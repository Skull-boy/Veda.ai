'use client';

import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { api, ApiError } from '@/lib/api';
import { useAssignmentStore } from '@/store/assignmentStore';
import type { QuestionType } from '@/types';

const qConfigSchema = z.object({
  type: z.enum(['mcq', 'short-answer', 'long-answer', 'true-false', 'fill-blank']),
  count: z.coerce.number().int().min(1, 'Min 1').max(50),
  marksPerQuestion: z.coerce.number().int().min(1, 'Min 1'),
});

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().min(1, 'Class is required'),
  totalMarks: z.coerce.number().int().min(1, 'Must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionConfigs: z.array(qConfigSchema).min(1),
  topics: z.string().optional().default(''),
  additionalInstructions: z.string().optional().default(''),
});

type FormValues = z.infer<typeof schema>;

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'mcq', label: 'Multiple Choice Questions' },
  { value: 'short-answer', label: 'Short Answer Questions' },
  { value: 'long-answer', label: 'Long Answer Questions' },
  { value: 'true-false', label: 'True / False' },
  { value: 'fill-blank', label: 'Fill in the Blank' },
];

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { setCurrentAssignmentId, setJobStatus, isSubmitting, setIsSubmitting } = useAssignmentStore();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      subject: '',
      grade: '',
      totalMarks: 30,
      dueDate: '',
      difficulty: 'medium',
      questionConfigs: [
        { type: 'mcq',          count: 10, marksPerQuestion: 1 },
        { type: 'short-answer', count: 5,  marksPerQuestion: 2 },
        { type: 'long-answer',  count: 2,  marksPerQuestion: 5 },
      ],
      topics: '',
      additionalInstructions: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'questionConfigs' });
  const watchedConfigs = watch('questionConfigs');
  const watchedTotal   = watch('totalMarks');

  const totalQuestions   = watchedConfigs?.reduce((sum, c) => sum + (Number(c.count) || 0), 0) ?? 0;
  const computedMarks    = watchedConfigs?.reduce((sum, c) => sum + (Number(c.count) || 0) * (Number(c.marksPerQuestion) || 0), 0) ?? 0;
  const marksMatch       = computedMarks === Number(watchedTotal);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      const { assignmentId } = await api.createAssignment(values as any, file ?? undefined);
      setCurrentAssignmentId(assignmentId);
      setJobStatus('pending');
      router.push(`/assignments/${assignmentId}`);
    } catch (err) {
      if (err instanceof ApiError) setSubmitError(err.message);
      else setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && ['application/pdf', 'text/plain'].includes(f.type)) setFile(f);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar
          showBack
          crumb="Create Assignment"
          crumbIcon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="#6B7280" strokeWidth="1.3"/>
              <path d="M4.5 5H9.5M4.5 7.5H8" stroke="#6B7280" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          }
        />

        <div style={{ padding: '28px 32px', maxWidth: '800px', width: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              Create Assignment
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              Fill in the details to generate your AI question paper.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ─── Assignment Details card ─── */}
            <Section title="Assignment Details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Title <Required /></label>
                  <input {...register('title')} className={`form-input${errors.title ? ' error' : ''}`} placeholder="e.g. Quiz on Electricity" />
                  {errors.title && <div className="form-error">{errors.title.message}</div>}
                </div>
                <div>
                  <label className="form-label">Subject <Required /></label>
                  <input {...register('subject')} className={`form-input${errors.subject ? ' error' : ''}`} placeholder="e.g. Science" />
                  {errors.subject && <div className="form-error">{errors.subject.message}</div>}
                </div>
                <div>
                  <label className="form-label">Class / Grade <Required /></label>
                  <input {...register('grade')} className={`form-input${errors.grade ? ' error' : ''}`} placeholder="e.g. 8th, Grade 5" />
                  {errors.grade && <div className="form-error">{errors.grade.message}</div>}
                </div>
                <div>
                  <label className="form-label">Total Marks <Required /></label>
                  <input {...register('totalMarks')} type="number" min={1} className={`form-input${errors.totalMarks ? ' error' : ''}`} placeholder="20" />
                  {errors.totalMarks && <div className="form-error">{errors.totalMarks.message}</div>}
                </div>
                <div>
                  <label className="form-label">Due Date <Required /></label>
                  <input {...register('dueDate')} type="date" className={`form-input${errors.dueDate ? ' error' : ''}`} min={new Date().toISOString().split('T')[0]} />
                  {errors.dueDate && <div className="form-error">{errors.dueDate.message}</div>}
                </div>
              </div>
            </Section>

            {/* ─── Choose File ─── */}
            <Section title="Choose File" subtitle="Optional — upload reference material (PDF or TXT)">
              <div
                className={`upload-zone${dragOver ? ' active' : ''}`}
                onDrop={handleFileDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                {file ? (
                  <>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <rect x="4" y="2" width="16" height="20" rx="3" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.5"/>
                      <path d="M14 2v6h6" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#F97316' }}>{file.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      style={{ fontSize: '11px', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M14 18V8M14 8L10 12M14 8l4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 20v1a2 2 0 002 2h14a2 2 0 002-2v-1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>
                      <span style={{ color: '#F97316', fontWeight: 500 }}>Click to upload</span> or drag and drop
                    </span>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>PDF or TXT · Max 5MB</span>
                  </>
                )}
              </div>
              <input id="file-input" type="file" accept=".pdf,.txt" style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
            </Section>

            {/* ─── Question Type ─── */}
            <Section title="Question Types">
              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 32px', gap: '10px', marginBottom: '8px', padding: '0 2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>No. of Qs</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marks/Q</span>
                <span />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {fields.map((field, index) => (
                  <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 32px', gap: '10px', alignItems: 'start' }}>
                    <select {...register(`questionConfigs.${index}.type`)} className="form-select">
                      {QUESTION_TYPES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <div>
                      <input {...register(`questionConfigs.${index}.count`)} type="number" min={1} max={50}
                        className="form-input" placeholder="10" style={{ textAlign: 'center' }} />
                      {errors.questionConfigs?.[index]?.count && (
                        <div className="form-error">{errors.questionConfigs[index]?.count?.message}</div>
                      )}
                    </div>
                    <div>
                      <input {...register(`questionConfigs.${index}.marksPerQuestion`)} type="number" min={1}
                        className="form-input" placeholder="2" style={{ textAlign: 'center' }} />
                    </div>
                    <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}
                      style={{ width: '32px', height: '38px', border: '1px solid #E8EAED', borderRadius: '8px', background: '#fff', cursor: fields.length === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: fields.length === 1 ? '#D1D5DB' : '#6B7280', flexShrink: 0 }}>
                      <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
                        <path d="M1 1h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => append({ type: 'mcq', count: 5, marksPerQuestion: 1 })}
                style={{ marginTop: '10px', background: 'none', border: '1px dashed #D1D5DB', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#6B7280', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'border-color 0.15s' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Add Question Type
              </button>
            </Section>

            {/* ─── Difficulty ─── */}
            <Section title="Difficulty Level">
              <div style={{ display: 'flex', gap: '10px' }}>
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1, padding: '10px 14px', border: '1px solid #E8EAED', borderRadius: '8px', background: '#fff' }}>
                    <input type="radio" {...register('difficulty')} value={d} style={{ accentColor: '#F97316' }} />
                    <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500, textTransform: 'capitalize' }}>{d}</span>
                  </label>
                ))}
              </div>
            </Section>

            {/* ─── Additional Instructions ─── */}
            <Section title="Additional Instructions">
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Topics (comma separated)</label>
                <input {...register('topics')} className="form-input" placeholder="e.g. Newton's Laws, Thermodynamics" />
              </div>
              <div>
                <label className="form-label">Additional Instructions</label>
                <textarea {...register('additionalInstructions')} className="form-textarea"
                  placeholder="e.g. Include at least 2 diagram-based questions" rows={3} />
              </div>
            </Section>

            {/* Marks summary bar */}
            <div style={{ background: marksMatch ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${marksMatch ? '#BBF7D0' : '#FDE68A'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: computedMarks > 0 ? '10px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    {marksMatch
                      ? <path d="M2 7l4 4 6-6" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      : <path d="M7 4v4M7 10v.5" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round"/>}
                  </svg>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: marksMatch ? '#15803D' : '#92400E' }}>
                    {marksMatch ? 'Marks balanced ✓' : `Computed: ${computedMarks} marks · Entered total: ${watchedTotal ?? '—'}`}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{totalQuestions} question{totalQuestions !== 1 ? 's' : ''}</span>
              </div>

              {/* Per-section breakdown */}
              {watchedConfigs && watchedConfigs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {watchedConfigs.map((c, i) => {
                    const sectionMarks = (Number(c.count) || 0) * (Number(c.marksPerQuestion) || 0);
                    const label = c.type === 'mcq' ? 'MCQ' : c.type === 'short-answer' ? 'Short Ans' : c.type === 'long-answer' ? 'Long Ans' : c.type;
                    return sectionMarks > 0 ? (
                      <span key={i} style={{ fontSize: '11px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '6px', padding: '2px 8px', color: '#374151', fontWeight: 500 }}>
                        {label}: {c.count} × {c.marksPerQuestion}mk = <strong>{sectionMarks}</strong>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {submitError && (
              <div style={{ background: '#FFF1F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' }}>
                {submitError}
              </div>
            )}

            {/* Footer buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
                ← Previous
              </button>
              <button type="submit" className="btn-orange" disabled={isSubmitting} style={{ minWidth: '140px' }}>
                {isSubmitting ? (
                  <><div className="spinner" /> Generating...</>
                ) : (
                  <>Generate Paper →</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E8EAED', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: subtitle ? '2px' : 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '12px', color: '#6B7280' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Required() {
  return <span style={{ color: '#EF4444', marginLeft: '2px' }}>*</span>;
}
