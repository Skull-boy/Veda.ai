'use client';

import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function FileUpload({ file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files[0];
      if (dropped && isValidFile(dropped)) onChange(dropped);
    },
    [onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected && isValidFile(selected)) onChange(selected);
    },
    [onChange]
  );

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-12 p-8 flex flex-col items-center gap-3',
          'cursor-pointer transition-all duration-200',
          file
            ? 'border-brand-300 bg-brand-50'
            : 'border-surface-300 bg-surface-50 hover:border-brand-300 hover:bg-brand-50/50'
        )}
      >
        {file ? (
          <>
            <div className="w-10 h-10 bg-brand-100 rounded-12 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4H12L16 8V17H4V4Z" stroke="#4a54ec" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 4V8H16" stroke="#4a54ec" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-brand-700 font-sans">{file.name}</p>
              <p className="text-xs text-ink-400 font-sans mt-0.5">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="text-xs text-red-500 hover:underline font-sans"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-surface-200 rounded-12 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 13V4M10 4L7 7M10 4L13 7" stroke="#9698b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 14V16H17V14" stroke="#9698b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-ink-500 font-sans">
                <span className="text-brand-600 font-semibold">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-ink-300 font-sans mt-1">PDF or TXT · Max 5MB</p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,text/plain,application/pdf"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

function isValidFile(f: File) {
  return (
    ['application/pdf', 'text/plain'].includes(f.type) && f.size <= 5 * 1024 * 1024
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
