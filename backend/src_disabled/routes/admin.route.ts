import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

// Dashboard
router.get('/dashboard', isAuthenticated, isAdmin, asyncHandler(adminController.getDashboardStats));

// User Management
router.get('/users', isAuthenticated, isAdmin, asyncHandler(adminController.getAllUsers));
router.get('/users/:id', isAuthenticated, isAdmin, asyncHandler(adminController.getUserById));
router.put('/users/:id/status', isAuthenticated, isAdmin, asyncHandler(adminController.updateUserStatus));
router.delete('/users/:id', isAuthenticated, isAdmin, asyncHandler(adminController.deleteUser));

// Company Verification
router.get('/companies/pending', isAuthenticated, isAdmin, asyncHandler(adminController.getPendingCompanies));
router.put('/companies/:id/verify', isAuthenticated, isAdmin, asyncHandler(adminController.verifyCompany));
router.put('/companies/:id/reject', isAuthenticated, isAdmin, asyncHandler(adminController.rejectCompany));

// Job Moderation
router.get('/jobs/pending', isAuthenticated, isAdmin, asyncHandler(adminController.getPendingJobs));
router.put('/jobs/:id/approve', isAuthenticated, isAdmin, asyncHandler(adminController.approveJob));
router.put('/jobs/:id/reject', isAuthenticated, isAdmin, asyncHandler(adminController.rejectJob));

// Reports
router.get('/reports', isAuthenticated, isAdmin, asyncHandler(adminController.getReports));
router.get('/reports/:id', isAuthenticated, isAdmin, asyncHandler(adminController.getReportById));
router.put('/reports/:id/resolve', isAuthenticated, isAdmin, asyncHandler(adminController.resolveReport));

// Analytics
router.get('/analytics/users', isAuthenticated, isAdmin, asyncHandler(adminController.getUserAnalytics));
router.get('/analytics/jobs', isAuthenticated, isAdmin, asyncHandler(adminController.getJobAnalytics));
router.get('/analytics/companies', isAuthenticated, isAdmin, asyncHandler(adminController.getCompanyAnalytics));

// Settings
router.get('/settings', isAuthenticated, isAdmin, asyncHandler(adminController.getPlatformSettings));
router.put('/settings', isAuthenticated, isAdmin, asyncHandler(adminController.updatePlatformSettings));

export default router;
