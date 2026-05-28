import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { Assignment } from '../models/Assignment';
import { generationQueue } from '../services/queue';
import type { CreateAssignmentDTO } from '../types';

// Multer: memory storage for file uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'));
    }
  },
});

export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dto: CreateAssignmentDTO = req.body;

    // Parse questionConfigs if sent as string (from FormData)
    if (typeof dto.questionConfigs === 'string') {
      dto.questionConfigs = JSON.parse(dto.questionConfigs);
    }

    // Extract file content if uploaded
    let fileContent: string | undefined;
    const file = req.file;
    if (file) {
      if (file.mimetype === 'application/pdf') {
        const data = await pdfParse(file.buffer);
        fileContent = data.text;
      } else {
        fileContent = file.buffer.toString('utf-8');
      }
    }

    // Create assignment document
    const assignment = await Assignment.create({
      ...dto,
      dueDate: new Date(dto.dueDate),
      fileContent,
      status: 'pending',
    });

    // Queue the generation job
    const job = await generationQueue.add('generate', {
      assignmentId: assignment._id.toString(),
    });

    // Update assignment with jobId
    await Assignment.findByIdAndUpdate(assignment._id, { jobId: job.id });

    res.status(202).json({
      success: true,
      assignmentId: assignment._id.toString(),
      jobId: job.id,
      message: 'Assignment created. Generation in progress.',
    });
  } catch (err) {
    next(err);
  }
}

export async function getAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id).lean();

    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    res.json({ success: true, assignment });
  } catch (err) {
    next(err);
  }
}

export async function regenerateAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    if (assignment.status === 'processing') {
      res.status(409).json({
        success: false,
        message: 'Assignment is already being processed',
      });
      return;
    }

    // Reset status
    await Assignment.findByIdAndUpdate(id, {
      status: 'pending',
      generatedPaper: null,
      errorMessage: null,
    });

    const job = await generationQueue.add('generate', {
      assignmentId: id,
    });

    await Assignment.findByIdAndUpdate(id, { jobId: job.id });

    res.json({
      success: true,
      assignmentId: id,
      jobId: job.id,
      message: 'Regeneration queued',
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (err) {
    next(err);
  }
}

export async function listAssignments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '10'), 10);
    const skip = (page - 1) * limit;

    const [assignments, total] = await Promise.all([
      Assignment.find({}, '-fileContent -generatedPaper')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Assignment.countDocuments(),
    ]);

    res.json({
      success: true,
      assignments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}
