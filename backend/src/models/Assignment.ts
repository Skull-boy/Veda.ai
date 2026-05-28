import { Schema, model, Document } from 'mongoose';
import type {
  QuestionConfig,
  Difficulty,
  JobStatus,
  GeneratedPaper,
} from '../types';

export interface IAssignment extends Document {
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  dueDate: Date;
  questionConfigs: QuestionConfig[];
  difficulty: Difficulty;
  topics?: string;
  additionalInstructions?: string;
  fileContent?: string; // extracted text from uploaded file
  status: JobStatus;
  jobId?: string;
  generatedPaper?: GeneratedPaper;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionConfigSchema = new Schema<QuestionConfig>(
  {
    type: {
      type: String,
      enum: ['mcq', 'short-answer', 'long-answer', 'true-false', 'fill-blank'],
      required: true,
    },
    count: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    totalMarks: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
    questionConfigs: { type: [QuestionConfigSchema], required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    topics: { type: String, trim: true },
    additionalInstructions: { type: String, trim: true },
    fileContent: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    jobId: { type: String },
    generatedPaper: { type: Schema.Types.Mixed },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

// Index for efficient queries
AssignmentSchema.index({ status: 1, createdAt: -1 });
AssignmentSchema.index({ jobId: 1 });

export const Assignment = model<IAssignment>('Assignment', AssignmentSchema);
