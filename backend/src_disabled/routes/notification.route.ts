import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import * as notificationController from '../controllers/notification.controller.js';

const router = Router();

router.get('/', isAuthenticated, asyncHandler(notificationController.getNotifications));
router.put('/:id/read', isAuthenticated, asyncHandler(notificationController.markAsRead));
router.put('/read-all', isAuthenticated, asyncHandler(notificationController.markAllAsRead));
router.delete('/:id', isAuthenticated, asyncHandler(notificationController.deleteNotification));
router.delete('/clear-all', isAuthenticated, asyncHandler(notificationController.clearAllNotifications));

export default router;
