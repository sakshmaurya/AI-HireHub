import { z } from 'zod';

export const createResumeSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Resume title is required'),
    summary: z.string().min(50, 'Summary must be at least 50 characters'),
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
    experience: z.array(z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean().default(false),
      description: z.string(),
    })).optional(),
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      gpa: z.string().optional(),
    })).optional(),
    projects: z.array(z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      link: z.string().url().optional(),
    })).optional(),
    certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      credentialId: z.string().optional(),
    })).optional(),
    languages: z.array(z.object({
      language: z.string(),
      proficiency: z.enum(['basic', 'intermediate', 'advanced', 'native']),
    })).optional(),
  }),
});

export const updateResumeSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    summary: z.string().min(50).optional(),
    skills: z.array(z.string()).optional(),
    experience: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    projects: z.array(z.any()).optional(),
    certifications: z.array(z.any()).optional(),
    languages: z.array(z.any()).optional(),
    isDefault: z.boolean().optional(),
  }),
});
