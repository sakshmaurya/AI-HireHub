import { Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getConversations = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, []);
});

export const getConversationMessages = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, []);
});

export const createConversation = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { _id: 'placeholder' });
});

export const sendMessage = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { _id: 'placeholder' });
});

export const markMessagesAsRead = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { message: 'Messages marked as read' });
});
