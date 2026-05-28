'use client';

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { cn } from '@/lib/utils';
import type { QuestionType } from '@/types';

interface Props {
  index: number;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onRemove: () => void;
  canRemove: boolean;
  questionTypes: { value: QuestionType; label: string }[];
}

export function QuestionConfigRow({
  index,
  register,
  errors,
  onRemove,
  canRemove,
  questionTypes,
}: Props) {
  const rowErrors = (errors.questionConfigs as any)?.[index];

  return (
    <div className="grid grid-cols-12 gap-3 items-start animate-fade-in">
      <div className="col-span-5">
        <select
          {...register(`questionConfigs.${index}.type`)}
          className={cn('input-base', rowErrors?.type && 'input-error')}
        >
          {questionTypes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-3">
        <input
          {...register(`questionConfigs.${index}.count`)}
          type="number"
          min={1}
          max={50}
          placeholder="10"
          className={cn('input-base', rowErrors?.count && 'input-error')}
        />
        {rowErrors?.count && (
          <p className="mt-1 text-xs text-red-500">{rowErrors.count.message as string}</p>
        )}
      </div>

      <div className="col-span-3">
        <input
          {...register(`questionConfigs.${index}.marksPerQuestion`)}
          type="number"
          min={1}
          max={100}
          placeholder="2"
          className={cn('input-base', rowErrors?.marksPerQuestion && 'input-error')}
        />
        {rowErrors?.marksPerQuestion && (
          <p className="mt-1 text-xs text-red-500">{rowErrors.marksPerQuestion.message as string}</p>
        )}
      </div>

      <div className="col-span-1 flex items-center justify-center pt-2.5">
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label="Remove question type"
          className={cn(
            'w-8 h-8 rounded-8 flex items-center justify-center transition-all duration-200',
            canRemove
              ? 'text-ink-300 hover:text-red-500 hover:bg-red-50'
              : 'text-ink-100 cursor-not-allowed'
          )}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
