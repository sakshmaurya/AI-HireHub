import { Router } from 'express';
import { isAuthenticated, isRecruiter } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import * as interviewController from '../controllers/interview.controller.js';

const router = Router();

router.post('/', isAuthenticated, isRecruiter, asyncHandler(interviewController.scheduleInterview));
router.get('/', isAuthenticated, asyncHandler(interviewController.getInterviews));
router.get('/:id', isAuthenticated, asyncHandler(interviewController.getInterviewById));
router.put('/:id', isAuthenticated, asyncHandler(interviewController.updateInterview));
router.put('/:id/status', isAuthenticated, asyncHandler(interviewController.updateInterviewStatus));
router.delete('/:id', isAuthenticated, asyncHandler(interviewController.cancelInterview));
router.post('/:id/feedback', isAuthenticated, asyncHandler(interviewController.submitFeedback));
router.get('/:id/feedback', isAuthenticated, asyncHandler(interviewController.getFeedback));

export default router;
