import { z } from 'zod';

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Job title must be at least 3 characters'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    requirements: z.string().min(20, 'Requirements must be at least 20 characters'),
    responsibilities: z.string().min(20, 'Responsibilities must be at least 20 characters'),
    location: z.string().min(2, 'Location is required'),
    salary: z.object({
      min: z.number().positive('Minimum salary must be positive'),
      max: z.number().positive('Maximum salary must be positive'),
      currency: z.string().default('USD'),
    }).optional(),
    jobType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']),
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
    category: z.string(),
    applicationDeadline: z.string().optional(),
    remote: z.boolean().default(false),
    visaSponsorship: z.boolean().default(false),
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(50).optional(),
    requirements: z.string().min(20).optional(),
    responsibilities: z.string().min(20).optional(),
    location: z.string().min(2).optional(),
    salary: z.object({
      min: z.number().positive(),
      max: z.number().positive(),
      currency: z.string(),
    }).optional(),
    jobType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']).optional(),
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).optional(),
    skills: z.array(z.string()).optional(),
    category: z.string().optional(),
    applicationDeadline: z.string().optional(),
    status: z.enum(['active', 'closed', 'draft']).optional(),
    remote: z.boolean().optional(),
    visaSponsorship: z.boolean().optional(),
  }),
});

export const jobQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    location: z.string().optional(),
    jobType: z.string().optional(),
    experienceLevel: z.string().optional(),
    category: z.string().optional(),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    remote: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
  }),
});
