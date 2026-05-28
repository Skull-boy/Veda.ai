export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'short-answer' | 'long-answer' | 'true-false' | 'fill-blank';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface QuestionConfig {
  type: QuestionType;
  count: number;
  marksPerQuestion: number;
}

export interface CreateAssignmentDTO {
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  dueDate: string;
  questionConfigs: QuestionConfig[];
  difficulty: Difficulty;
  topics?: string;
  additionalInstructions?: string;
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  options?: string[]; // for MCQ
  answer?: string;    // stored but not rendered to students
}

export interface GeneratedSection {
  id: string;
  title: string;        // "Section A"
  instruction: string;  // "Attempt all questions"
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

export interface WSEvent {
  type: 'job:started' | 'job:progress' | 'job:completed' | 'job:failed';
  payload: {
    assignmentId: string;
    progress?: number;
    paper?: GeneratedPaper;
    error?: string;
  };
}
