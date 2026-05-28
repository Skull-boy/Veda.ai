import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Assignment, GeneratedPaper, JobStatus } from '@/types';

interface AssignmentState {
  currentAssignmentId: string | null;
  currentAssignment: Assignment | null;
  jobStatus: JobStatus | null;
  jobProgress: number;
  generatedPaper: GeneratedPaper | null;
  errorMessage: string | null;
  isSubmitting: boolean;
  isRegenerating: boolean;

  setCurrentAssignmentId: (id: string | null) => void;
  setCurrentAssignment: (a: Assignment | null) => void;
  setJobStatus: (s: JobStatus) => void;
  setJobProgress: (p: number) => void;
  setGeneratedPaper: (paper: GeneratedPaper) => void;
  setErrorMessage: (msg: string | null) => void;
  setIsSubmitting: (v: boolean) => void;
  setIsRegenerating: (v: boolean) => void;
  reset: () => void;
}

const init = {
  currentAssignmentId: null,
  currentAssignment: null,
  jobStatus: null,
  jobProgress: 0,
  generatedPaper: null,
  errorMessage: null,
  isSubmitting: false,
  isRegenerating: false,
};

export const useAssignmentStore = create<AssignmentState>()(
  devtools(
    (set) => ({
      ...init,
      setCurrentAssignmentId: (id) => set({ currentAssignmentId: id }),
      setCurrentAssignment: (a) => set({ currentAssignment: a }),
      setJobStatus: (s) => set({ jobStatus: s }),
      setJobProgress: (p) => set({ jobProgress: p }),
      setGeneratedPaper: (paper) => set({ generatedPaper: paper }),
      setErrorMessage: (msg) => set({ errorMessage: msg }),
      setIsSubmitting: (v) => set({ isSubmitting: v }),
      setIsRegenerating: (v) => set({ isRegenerating: v }),
      reset: () => set(init),
    }),
    { name: 'assignment-store' }
  )
);
