import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const QuestionConfigSchema = z.object({
  type: z.enum(['mcq', 'short-answer', 'long-answer', 'true-false', 'fill-blank']),
  count: z.coerce.number().int().min(1, 'Count must be at least 1'),
  marksPerQuestion: z.coerce.number().int().min(1, 'Marks must be at least 1'),
});

const CreateAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  subject: z.string().min(2, 'Subject is required').max(100),
  grade: z.string().min(1, 'Grade is required').max(50),
  totalMarks: z.coerce.number().int().min(1, 'Total marks must be positive'),
  dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  questionConfigs: z
    .preprocess(
      (val) => (typeof val === 'string' ? JSON.parse(val) : val),
      z.array(QuestionConfigSchema).min(1, 'At least one question type required')
    ),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topics: z.string().max(500).optional(),
  additionalInstructions: z.string().max(1000).optional(),
});

export function validateCreateAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const result = CreateAssignmentSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }
  req.body = result.data;
  next();
}
