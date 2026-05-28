'use client';

import type { GeneratedPaper, GeneratedQuestion, Difficulty } from '@/types';

interface Props { paper: GeneratedPaper; }

export default function QuestionPaper({ paper }: Props) {
  return (
    <div className="paper-container fade-in" id="question-paper">
      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #E5E5E5' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
          Delhi Public School, Sector-4, Bokaro
        </h1>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
          Subject: {paper.subject}
        </p>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
          Class: {paper.grade}
        </p>
      </div>

      {/* ── Meta row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
          Time Allowed: {paper.duration}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
          Maximum Marks: {paper.totalMarks}
        </span>
      </div>

      {/* ── General instruction ── */}
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>
        All questions are compulsory unless stated otherwise.
      </p>

      {/* ── Student info ── */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '14px', color: '#111827', marginBottom: '10px' }}>
          Name: <span style={{ display: 'inline-block', width: '180px', borderBottom: '1px solid #374151', marginLeft: '4px' }} />
        </p>
        <p style={{ fontSize: '14px', color: '#111827', marginBottom: '10px' }}>
          Roll Number: <span style={{ display: 'inline-block', width: '140px', borderBottom: '1px solid #374151', marginLeft: '4px' }} />
        </p>
        <p style={{ fontSize: '14px', color: '#111827' }}>
          Class: {paper.grade} &nbsp; Section: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #374151', marginLeft: '4px' }} />
        </p>
      </div>

      {/* ── Sections ── */}
      {paper.sections.map((section, sIdx) => (
        <div key={section.id} style={{ marginBottom: '36px' }}>
          {/* Section title */}
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: '16px' }}>
            {section.title}
          </h2>

          {/* Section type heading */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
              {section.questions[0]?.type === 'short-answer' ? 'Short Answer Questions' :
               section.questions[0]?.type === 'long-answer' ? 'Long Answer Questions' :
               section.questions[0]?.type === 'mcq' ? 'Multiple Choice Questions' :
               section.questions[0]?.type === 'true-false' ? 'True or False' :
               section.questions[0]?.type === 'fill-blank' ? 'Fill in the Blanks' :
               'Questions'}
            </p>
            <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#374151' }}>
              {section.instruction}
            </p>
          </div>

          {/* Questions */}
          <ol style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {section.questions.map((q, qIdx) => (
              <QuestionItem key={q.id} question={q} number={qIdx + 1} />
            ))}
          </ol>

          {sIdx === paper.sections.length - 1 && (
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginTop: '28px' }}>
              End of Question Paper
            </p>
          )}
        </div>
      ))}

      {/* ── Answer Key ── */}
      <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid #E5E5E5' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
          Answer Key:
        </h2>
        {paper.sections.map((section) =>
          section.questions.map((q, qIdx) =>
            q.answer ? (
              <div key={q.id} style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', color: '#111827', flexShrink: 0, fontWeight: 500 }}>{qIdx + 1}.</span>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{q.answer}</p>
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
}

function QuestionItem({ question, number }: { question: GeneratedQuestion; number: number }) {
  return (
    <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '14px', color: '#111827', flexShrink: 0, minWidth: '24px', fontWeight: 500 }}>{number}.</span>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '14px', color: '#111827', lineHeight: '1.65' }}>
          <DifficultyTag difficulty={question.difficulty} />{' '}
          {question.text}{' '}
          <span style={{ fontWeight: 600 }}>[{question.marks} Marks]</span>
        </span>
        {/* MCQ options */}
        {question.options && question.options.length > 0 && (
          <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {question.options.map((opt, i) => (
              <div key={i} style={{ fontSize: '14px', color: '#374151' }}>
                ({String.fromCharCode(65 + i)}) {opt.replace(/^[A-D][.)]\s*/i, '')}
              </div>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

function DifficultyTag({ difficulty }: { difficulty: Difficulty }) {
  const isEasy = difficulty === 'easy';
  const isMed = difficulty === 'medium';
  const label = isEasy ? 'Easy' : isMed ? 'Moderate' : 'Challenging';
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 600,
      background: isEasy ? '#DEF7EC' : isMed ? '#FEF08A' : '#FDE8E8',
      color: isEasy ? '#03543F' : isMed ? '#854D0E' : '#9B1C1C',
      marginRight: '6px',
      verticalAlign: 'middle',
      border: `1px solid ${isEasy ? '#84E1BC' : isMed ? '#FDE047' : '#F8B4B4'}`,
    }}>
      {label}
    </span>
  );
}
