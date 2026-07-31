import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import * as chatController from '../controllers/chat.controller.js';

const router = Router();

router.get('/conversations', isAuthenticated, asyncHandler(chatController.getConversations));
router.get('/conversations/:id/messages', isAuthenticated, asyncHandler(chatController.getMessages));
router.post('/conversations', isAuthenticated, asyncHandler(chatController.createConversation));
router.post('/conversations/:id/messages', isAuthenticated, asyncHandler(chatController.sendMessage));
router.put('/conversations/:id/read', isAuthenticated, asyncHandler(chatController.markAsRead));
router.delete('/conversations/:id', isAuthenticated, asyncHandler(chatController.deleteConversation));

export default router;
