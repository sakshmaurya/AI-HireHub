import { Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const scheduleInterview = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { _id: 'placeholder' });
});

export const getInterviews = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, []);
});

export const getInterviewById = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { _id: 'placeholder' });
});

export const updateInterview = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { _id: 'placeholder' });
});

export const cancelInterview = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { _id: 'placeholder' });
});

export const submitFeedback = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, { _id: 'placeholder' });
});

export const getUpcomingInterviews = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, []);
});

export const getPastInterviews = asyncHandler(async (req: any, res: Response) => {
  return ApiResponse.success(res, []);
});
