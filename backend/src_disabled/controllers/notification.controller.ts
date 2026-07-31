import { Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getNotifications = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { notifications: [], unreadCount: 0 });
});

export const markAsRead = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { message: 'Notification marked as read' });
});

export const markAllAsRead = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { message: 'All notifications marked as read' });
});

export const deleteNotification = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { message: 'Notification deleted' });
});
