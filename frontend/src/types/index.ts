export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType =
  | 'mcq'
  | 'short-answer'
  | 'long-answer'
  | 'true-false'
  | 'fill-blank';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface QuestionConfig {
  type: QuestionType;
  count: number;
  marksPerQuestion: number;
}

export interface CreateAssignmentForm {
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  dueDate: string;
  questionConfigs: QuestionConfig[];
  difficulty: Difficulty;
  topics: string;
  additionalInstructions: string;
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  options?: string[];
  answer?: string;
}

export interface GeneratedSection {
  id: string;
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
  totalMarks: number;
}

export interface GeneratedPaper {
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  duration: string;
  sections: GeneratedSection[];
  generatedAt: string;
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  dueDate: string;
  questionConfigs: QuestionConfig[];
  difficulty: Difficulty;
  topics?: string;
  additionalInstructions?: string;
  status: JobStatus;
  jobId?: string;
  generatedPaper?: GeneratedPaper;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WSEvent {
  type: 'job:started' | 'job:progress' | 'job:completed' | 'job:failed';
  payload: {
    assignmentId: string;
    progress?: number;
    paper?: GeneratedPaper;
    error?: string;
  };
}
