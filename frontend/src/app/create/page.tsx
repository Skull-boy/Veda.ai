'use client';

import Link from 'next/link';
import { AssignmentForm } from '@/components/forms/AssignmentForm';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-surface-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="btn-ghost px-3 py-2 text-ink-500"
            aria-label="Back to home"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className="w-px h-5 bg-surface-300" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-600 rounded-8 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-ink-900">VedaAI</span>
          </div>
          <div className="ml-auto">
            <span className="text-ink-300 text-sm font-sans">New Assessment</span>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display font-bold text-3xl text-ink-900 mb-2">
            Create Assessment
          </h1>
          <p className="text-ink-500 font-sans">
            Fill in the details below. Our AI will generate a structured question paper for you.
          </p>
        </div>

        <AssignmentForm />
      </main>
    </div>
  );
}
