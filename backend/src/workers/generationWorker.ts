import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import mongoose from 'mongoose';
import { Assignment } from '../models/Assignment';
import { generateQuestionPaper } from '../services/geminiService';
import { broadcastToRoom } from '../config/websocket';
import type { GenerationJobData } from '../services/queue';
import type { CreateAssignmentDTO } from '../types';

import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

async function processGenerationJob(job: Job<GenerationJobData>): Promise<void> {
  const { assignmentId } = job.data;

  console.log(`[worker] Processing job ${job.id} for assignment ${assignmentId}`);

  // Mark as processing
  await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
  broadcastToRoom(assignmentId, {
    type: 'job:started',
    payload: { assignmentId, progress: 10 },
  });

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error(`Assignment ${assignmentId} not found`);
  }

  broadcastToRoom(assignmentId, {
    type: 'job:progress',
    payload: { assignmentId, progress: 30 },
  });

  // Build DTO from stored assignment
  const dto: CreateAssignmentDTO = {
    title: assignment.title,
    subject: assignment.subject,
    grade: assignment.grade,
    totalMarks: assignment.totalMarks,
    dueDate: assignment.dueDate.toISOString(),
    questionConfigs: assignment.questionConfigs,
    difficulty: assignment.difficulty,
    topics: assignment.topics,
    additionalInstructions: assignment.additionalInstructions,
  };

  broadcastToRoom(assignmentId, {
    type: 'job:progress',
    payload: { assignmentId, progress: 50 },
  });

  const paper = await generateQuestionPaper(dto, assignment.fileContent);

  broadcastToRoom(assignmentId, {
    type: 'job:progress',
    payload: { assignmentId, progress: 85 },
  });

  // Store result
  await Assignment.findByIdAndUpdate(assignmentId, {
    status: 'completed',
    generatedPaper: paper,
    jobId: job.id,
  });

  broadcastToRoom(assignmentId, {
    type: 'job:completed',
    payload: { assignmentId, progress: 100, paper },
  });

  console.log(`[worker] Job ${job.id} completed for assignment ${assignmentId}`);
}

// Bootstrap the worker
async function startWorker(): Promise<void> {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/vedaai');

  const worker = new Worker<GenerationJobData>(
    'generation',
    processGenerationJob,
    {
      connection: connection as any,
      concurrency: 3,
    }
  );

  worker.on('failed', async (job, err) => {
    if (!job) return;
    console.error(`[worker] Job ${job.id} failed:`, err.message);

    await Assignment.findByIdAndUpdate(job.data.assignmentId, {
      status: 'failed',
      errorMessage: err.message,
    });

    broadcastToRoom(job.data.assignmentId, {
      type: 'job:failed',
      payload: {
        assignmentId: job.data.assignmentId,
        error: err.message,
      },
    });
  });

  console.log('[worker] Generation worker started');
}

startWorker().catch(console.error);
