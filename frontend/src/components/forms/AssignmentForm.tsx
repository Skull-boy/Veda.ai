'use client';

import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api, ApiError } from '@/lib/api';
import { useAssignmentStore } from '@/store/assignmentStore';
import { FileUpload } from '@/components/ui/FileUpload';
import { QuestionConfigRow } from '@/components/forms/QuestionConfigRow';
import { cn } from '@/lib/utils';
import type { CreateAssignmentForm, Difficulty, QuestionType } from '@/types';

const questionConfigSchema = z.object({
  type: z.enum(['mcq', 'short-answer', 'long-answer', 'true-false', 'fill-blank']),
  count: z.coerce.number().int().min(1, 'Min 1'),
  marksPerQuestion: z.coerce.number().int().min(1, 'Min 1'),
});

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(2, 'Subject is required'),
  grade: z.string().min(1, 'Grade is required'),
  totalMarks: z.coerce.number().int().min(1, 'Must be at least 1'),
  dueDate: z.string().min(1, 'Due date is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionConfigs: z.array(questionConfigSchema).min(1, 'Add at least one question type'),
  topics: z.string().optional().default(''),
  additionalInstructions: z.string().optional().default(''),
});

type FormValues = z.infer<typeof schema>;

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'easy', label: 'Easy', desc: 'Recall & basic understanding' },
  { value: 'medium', label: 'Medium', desc: 'Application & analysis' },
  { value: 'hard', label: 'Hard', desc: 'Synthesis & evaluation' },
];

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'mcq', label: 'Multiple Choice' },
  { value: 'short-answer', label: 'Short Answer' },
  { value: 'long-answer', label: 'Long Answer' },
  { value: 'true-false', label: 'True / False' },
  { value: 'fill-blank', label: 'Fill in the Blank' },
];

export function AssignmentForm() {
  const router = useRouter();
  const { setCurrentAssignmentId, setJobStatus, setIsSubmitting, isSubmitting } =
    useAssignmentStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      subject: '',
      grade: '',
      totalMarks: 100,
      dueDate: '',
      difficulty: 'medium',
      questionConfigs: [{ type: 'mcq', count: 10, marksPerQuestion: 2 }],
      topics: '',
      additionalInstructions: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questionConfigs',
  });

  const selectedDifficulty = watch('difficulty');

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const form: CreateAssignmentForm = {
        ...values,
        difficulty: values.difficulty as Difficulty,
        topics: values.topics ?? '',
        additionalInstructions: values.additionalInstructions ?? '',
      };

      const { assignmentId } = await api.createAssignment(form, uploadedFile ?? undefined);

      setCurrentAssignmentId(assignmentId);
      setJobStatus('pending');

      toast.success('Assessment queued! Generating your paper…');
      router.push(`/result/${assignmentId}`);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        err.errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
      } else {
        toast.error(err instanceof Error ? err.message : 'Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestionType = useCallback(() => {
    append({ type: 'short-answer', count: 5, marksPerQuestion: 4 });
  }, [append]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
      {/* Basic Info */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="font-display font-semibold text-ink-900 text-base flex items-center gap-2">
          <span className="w-6 h-6 bg-brand-100 text-brand-700 rounded-6 flex items-center justify-center text-xs font-bold">1</span>
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-ink-700 mb-1.5 font-sans">
              Assessment Title <span className="text-red-400">*</span>
            </label>
            <input
              {...register('title')}
              placeholder="e.g. Mid-Term Examination — Chapter 3-5"
              className={cn('input-base', errors.title && 'input-error')}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500 font-sans">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5 font-sans">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              {...register('subject')}
              placeholder="e.g. Physics, Mathematics"
              className={cn('input-base', errors.subject && 'input-error')}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-500 font-sans">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5 font-sans">
              Grade / Class <span className="text-red-400">*</span>
            </label>
            <input
              {...register('grade')}
              placeholder="e.g. Grade 10, Class XII"
              className={cn('input-base', errors.grade && 'input-error')}
            />
            {errors.grade && (
              <p className="mt-1 text-xs text-red-500 font-sans">{errors.grade.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5 font-sans">
              Total Marks <span className="text-red-400">*</span>
            </label>
            <input
              {...register('totalMarks')}
              type="number"
              min={1}
              placeholder="100"
              className={cn('input-base', errors.totalMarks && 'input-error')}
            />
            {errors.totalMarks && (
              <p className="mt-1 text-xs text-red-500 font-sans">{errors.totalMarks.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5 font-sans">
              Due Date <span className="text-red-400">*</span>
            </label>
            <input
              {...register('dueDate')}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className={cn('input-base', errors.dueDate && 'input-error')}
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-500 font-sans">{errors.dueDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-ink-900 text-base flex items-center gap-2">
          <span className="w-6 h-6 bg-brand-100 text-brand-700 rounded-6 flex items-center justify-center text-xs font-bold">2</span>
          Overall Difficulty
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTY_OPTIONS.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('difficulty', value)}
              className={cn(
                'flex flex-col gap-1 p-4 rounded-12 border-2 text-left transition-all duration-200',
                selectedDifficulty === value
                  ? value === 'easy'
                    ? 'border-emerald-400 bg-emerald-50'
                    : value === 'medium'
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-rose-400 bg-rose-50'
                  : 'border-surface-200 bg-surface-50 hover:border-surface-300'
              )}
            >
              <span
                className={cn(
                  'text-sm font-semibold font-display',
                  selectedDifficulty === value
                    ? value === 'easy'
                      ? 'text-emerald-700'
                      : value === 'medium'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                    : 'text-ink-700'
                )}
              >
                {label}
              </span>
              <span className="text-xs text-ink-400 font-sans">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Question Config */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-ink-900 text-base flex items-center gap-2">
          <span className="w-6 h-6 bg-brand-100 text-brand-700 rounded-6 flex items-center justify-center text-xs font-bold">3</span>
          Question Configuration
        </h2>

        <div className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-3 px-1">
            <span className="col-span-5 text-xs font-medium text-ink-400 uppercase tracking-wide font-sans">Type</span>
            <span className="col-span-3 text-xs font-medium text-ink-400 uppercase tracking-wide font-sans">Count</span>
            <span className="col-span-3 text-xs font-medium text-ink-400 uppercase tracking-wide font-sans">Marks each</span>
            <span className="col-span-1" />
          </div>

          {fields.map((field, index) => (
            <QuestionConfigRow
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
              questionTypes={QUESTION_TYPES}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestionType}
          className="btn-ghost text-brand-600 hover:bg-brand-50 font-semibold"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Add Question Type
        </button>

        {errors.questionConfigs && (
          <p className="text-xs text-red-500 font-sans">
            {typeof errors.questionConfigs.message === 'string'
              ? errors.questionConfigs.message
              : 'Check question configuration'}
          </p>
        )}
      </div>

      {/* Topics & Instructions */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-ink-900 text-base flex items-center gap-2">
          <span className="w-6 h-6 bg-brand-100 text-brand-700 rounded-6 flex items-center justify-center text-xs font-bold">4</span>
          Topics & Instructions
        </h2>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5 font-sans">
            Topics to Cover
          </label>
          <input
            {...register('topics')}
            placeholder="e.g. Newton's Laws, Thermodynamics, Optics"
            className="input-base"
          />
          <p className="mt-1.5 text-xs text-ink-300 font-sans">Comma-separated. Leave blank for full curriculum.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5 font-sans">
            Additional Instructions
          </label>
          <textarea
            {...register('additionalInstructions')}
            rows={3}
            placeholder="e.g. Include at least 2 diagram-based questions. Avoid calculus."
            className="input-base resize-none"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-display font-semibold text-ink-900 text-base flex items-center gap-2">
          <span className="w-6 h-6 bg-brand-100 text-brand-700 rounded-6 flex items-center justify-center text-xs font-bold">5</span>
          Reference Material
          <span className="text-xs font-normal text-ink-400 font-sans ml-1">(optional)</span>
        </h2>
        <FileUpload file={uploadedFile} onChange={setUploadedFile} />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between py-2">
        <p className="text-xs text-ink-300 font-sans">Generation takes 15–30 seconds</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-8 py-3.5"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              Generate Paper
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
