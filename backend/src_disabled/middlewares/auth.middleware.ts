import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: `Role: ${req.user?.role} is not allowed to access this resource`,
      });
    }
    next();
  };
};

export const isRecruiter = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'recruiter') {
    return res.status(403).json({
      success: false,
      message: 'Only recruiters can access this resource',
    });
  }
  
  if (!req.user?.companyProfile) {
    return res.status(403).json({
      success: false,
      message: 'Please complete your company profile first',
    });
  }
  
  next();
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can access this resource',
    });
  }
  next();
};
