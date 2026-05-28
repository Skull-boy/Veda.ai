import { Router } from 'express';
import {
  createAssignment,
  getAssignment,
  regenerateAssignment,
  deleteAssignment,
  listAssignments,
  upload,
} from '../controllers/assignmentController';
import { validateCreateAssignment } from '../middleware/validation';

export const assignmentRouter = Router();

assignmentRouter.get('/', listAssignments);
assignmentRouter.post('/', upload.single('file'), validateCreateAssignment, createAssignment);
assignmentRouter.get('/:id', getAssignment);
assignmentRouter.post('/:id/regenerate', regenerateAssignment);
assignmentRouter.delete('/:id', deleteAssignment);
