import type { Assignment, CreateAssignmentForm } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(message: string, public status: number, public errors?: { field: string; message: string }[]) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init });
  const data = await res.json();
  if (!res.ok) throw new ApiError(data.message ?? 'Request failed', res.status, data.errors);
  return data;
}

export const api = {
  async createAssignment(form: CreateAssignmentForm, file?: File): Promise<{ assignmentId: string; jobId: string }> {
    const body = new FormData();
    body.append('title', form.title);
    body.append('subject', form.subject);
    body.append('grade', form.grade);
    body.append('totalMarks', String(form.totalMarks));
    body.append('dueDate', form.dueDate);
    body.append('difficulty', form.difficulty);
    body.append('questionConfigs', JSON.stringify(form.questionConfigs));
    if (form.topics) body.append('topics', form.topics);
    if (form.additionalInstructions) body.append('additionalInstructions', form.additionalInstructions);
    if (file) body.append('file', file);
    const data = await request<{ success: boolean; assignmentId: string; jobId: string }>('/api/assignments', { method: 'POST', body });
    return { assignmentId: data.assignmentId, jobId: data.jobId };
  },

  async getAssignment(id: string): Promise<Assignment> {
    const data = await request<{ success: boolean; assignment: Assignment }>(`/api/assignments/${id}`);
    return data.assignment;
  },

  async regenerateAssignment(id: string): Promise<{ jobId: string }> {
    const data = await request<{ success: boolean; jobId: string }>(`/api/assignments/${id}/regenerate`, { method: 'POST' });
    return { jobId: data.jobId };
  },

  async listAssignments(): Promise<Assignment[]> {
    const data = await request<{ success: boolean; assignments: Assignment[] }>('/api/assignments');
    return data.assignments;
  },

  async deleteAssignment(id: string): Promise<void> {
    await request<{ success: boolean }>(`/api/assignments/${id}`, { method: 'DELETE' });
  },
};
