import { z } from 'zod';

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    industry: z.string().min(2, 'Industry is required'),
    size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
    website: z.string().url('Invalid website URL'),
    location: z.object({
      address: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      zipCode: z.string(),
    }),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    logo: z.string().optional(),
    foundedYear: z.number().int().min(1800).max(new Date().getFullYear()),
    socialLinks: z.object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      facebook: z.string().url().optional(),
    }).optional(),
    benefits: z.array(z.string()).optional(),
  }),
});

export const updateCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    industry: z.string().min(2).optional(),
    size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
    website: z.string().url().optional(),
    location: z.object({
      address: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      zipCode: z.string(),
    }).optional(),
    description: z.string().min(50).optional(),
    logo: z.string().optional(),
    foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    socialLinks: z.object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      facebook: z.string().url().optional(),
    }).optional(),
    benefits: z.array(z.string()).optional(),
    verificationStatus: z.enum(['pending', 'verified', 'rejected']).optional(),
  }),
});
