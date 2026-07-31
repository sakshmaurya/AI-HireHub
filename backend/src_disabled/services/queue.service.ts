import Bull from 'bull';
import { redisClient } from '../utils/redis.js';

// Email queue
export const emailQueue = new Bull('email', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
  },
});

// AI processing queue
export const aiQueue = new Bull('ai-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
  },
});

// Resume parsing queue
export const resumeQueue = new Bull('resume-parsing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
  },
});

// Job recommendation queue
export const recommendationQueue = new Bull('job-recommendation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
  },
});

// Process email queue
emailQueue.process(async (job) => {
  const { to, subject, html, text } = job.data;
  // Email sending logic here
  console.log(`Sending email to ${to}: ${subject}`);
});

// Process AI queue
aiQueue.process(async (job) => {
  const { type, data } = job.data;
  // AI processing logic here
  console.log(`Processing AI task: ${type}`);
});

// Process resume queue
resumeQueue.process(async (job) => {
  const { resumeId, fileUrl } = job.data;
  // Resume parsing logic here
  console.log(`Parsing resume: ${resumeId}`);
});

// Process recommendation queue
recommendationQueue.process(async (job) => {
  const { userId, jobData } = job.data;
  // Job recommendation logic here
  console.log(`Generating recommendations for user: ${userId}`);
});

export default {
  emailQueue,
  aiQueue,
  resumeQueue,
  recommendationQueue,
};
