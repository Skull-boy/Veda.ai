'use client';

import type { JobStatus } from '@/types';

const STEPS = [
  { at: 10, label: 'Queuing job…' },
  { at: 30, label: 'Analysing requirements…' },
  { at: 50, label: 'Generating questions with AI…' },
  { at: 85, label: 'Structuring sections & marks…' },
  { at: 100, label: 'Finalising your paper…' },
];

export default function GenerationProgress({ progress, status }: { progress: number; status: JobStatus }) {
  const step = [...STEPS].reverse().find((s) => progress >= s.at) ?? STEPS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '20px' }}>
      {/* Pulsing icon */}
      <div style={{ position: 'relative', width: '72px', height: '72px' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#FFF7ED', animation: 'pulse 2s infinite' }} />
        <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', background: '#FED7AA', animation: 'pulse 2s 0.3s infinite' }} />
        <div style={{ position: 'absolute', inset: '16px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 2L16.5 5.5V12.5L11 16L5.5 12.5V5.5L11 2Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Generating Your Paper</h2>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>{step.label}</p>
      </div>

      {/* Progress bar */}
      <div style={{ width: '320px', maxWidth: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Progress</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F97316' }}>{progress}%</span>
        </div>
        <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#F97316', borderRadius: '3px', width: `${progress}%`, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      <p style={{ fontSize: '12px', color: '#9CA3AF' }}>This usually takes 15–30 seconds</p>
    </div>
  );
}
