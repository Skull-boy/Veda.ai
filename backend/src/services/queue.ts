import { Queue } from 'bullmq';

const connection = {
  host: new URL(process.env.REDIS_URL ?? 'redis://localhost:6379').hostname,
  port: parseInt(
    new URL(process.env.REDIS_URL ?? 'redis://localhost:6379').port || '6379',
    10
  ),
};

export const generationQueue = new Queue('generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export type GenerationJobData = {
  assignmentId: string;
};
