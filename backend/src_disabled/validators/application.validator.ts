import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, 'Job ID is required'),
    resumeId: z.string().min(1, 'Resume ID is required'),
    coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').optional(),
    expectedSalary: z.object({
      min: z.number().positive(),
      max: z.number().positive(),
      currency: z.string().default('USD'),
    }).optional(),
    availableStartDate: z.string().optional(),
    answers: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const updateApplicationStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn']),
    notes: z.string().optional(),
    interviewDate: z.string().optional(),
  }),
});

export const applicationQuerySchema = z.object({
  query: z.object({
    status: z.string().optional(),
    jobId: z.string().optional(),
    candidateId: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
  }),
});
