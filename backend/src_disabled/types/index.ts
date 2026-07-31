import { Document, Schema } from "mongoose";

// User Types
export enum UserRole {
  CANDIDATE = "candidate",
  RECRUITER = "recruiter",
  ADMIN = "admin",
}

export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWING = "reviewing",
  SHORTLISTED = "shortlisted",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_COMPLETED = "interview_completed",
  OFFERED = "offered",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export enum JobType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  REMOTE = "remote",
  HYBRID = "hybrid",
}

export enum ExperienceLevel {
  ENTRY = "entry",
  MID = "mid",
  SENIOR = "senior",
  LEAD = "lead",
  EXECUTIVE = "executive",
}

export enum CompanyStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
}

export enum NotificationType {
  APPLICATION_UPDATE = "application_update",
  JOB_MATCH = "job_match",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  MESSAGE = "message",
  SYSTEM = "system",
  PROFILE_VIEW = "profile_view",
}

// Interfaces
export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  refreshToken: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  otp?: string;
  otpExpires?: Date;
  profile: {
    bio: string;
    skills: string[];
    resume: string;
    resumePublicId: string;
    resumeOriginalName: string;
    resumeAnalysis: any;
    company?: Schema.Types.ObjectId;
    profilePhoto: string;
    profilePhotoPublicId: string;
    location?: string;
    website?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    experience: Array<{
      company: string;
      position: string;
      startDate: Date;
      endDate?: Date;
      current: boolean;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: Date;
      endDate?: Date;
      current: boolean;
      gpa?: string;
    }>;
    certificates: Array<{
      name: string;
      issuer: string;
      issueDate: Date;
      expiryDate?: Date;
      credentialUrl?: string;
    }>;
    languages: Array<{
      language: string;
      proficiency: string;
    }>;
  };
  preferences: {
    jobTypes: JobType[];
    locations: string[];
    industries: string[];
    salaryRange: {
      min: number;
      max: number;
    };
    remoteOnly: boolean;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  stats: {
    profileViews: number;
    applicationsCount: number;
    interviewsCount: number;
    offersCount: number;
  };
  lastActive?: Date;
}

export interface IJob extends Document {
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  experienceLevel: ExperienceLevel;
  location: string;
  isRemote: boolean;
  jobType: JobType;
  positions: number;
  company: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  applications: Schema.Types.ObjectId[];
  skills: string[];
  industry: string;
  department: string;
  employmentType: string;
  status: "draft" | "active" | "closed" | "paused";
  expiresAt?: Date;
  publishedAt?: Date;
  views: number;
  aiMatchScore?: number;
  salaryPrediction?: {
    min: number;
    max: number;
    confidence: number;
  };
}

export interface IApplication extends Document {
  job: Schema.Types.ObjectId;
  applicant: Schema.Types.ObjectId;
  recruiter: Schema.Types.ObjectId;
  status: ApplicationStatus;
  coverLetter: string;
  resume: string;
  resumePublicId: string;
  atsScore?: number;
  matchScore?: number;
  aiAnalysis?: any;
  timeline: Array<{
    status: ApplicationStatus;
    note?: string;
    createdAt: Date;
    createdBy: Schema.Types.ObjectId;
  }>;
  notes: Array<{
    content: string;
    createdBy: Schema.Types.ObjectId;
    createdAt: Date;
  }>;
  interviews: Schema.Types.ObjectId[];
  appliedAt: Date;
  updatedAt: Date;
}

export interface ICompany extends Document {
  name: string;
  slug: string;
  description: string;
  industry: string;
  size: string;
  foundedYear: number;
  website: string;
  logo: string;
  logoPublicId: string;
  coverImage: string;
  coverImagePublicId: string;
  locations: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  benefits: string[];
  culture: string;
  techStack: string[];
  status: CompanyStatus;
  verificationDocuments?: string[];
  verifiedBy?: Schema.Types.ObjectId;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdBy: Schema.Types.ObjectId;
  admins: Schema.Types.ObjectId[];
  jobs: Schema.Types.ObjectId[];
  stats: {
    jobsPosted: number;
    applicationsReceived: number;
    hiresMade: number;
    avgTimeToHire: number;
  };
}

export interface IResume extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  template: Schema.Types.ObjectId;
  content: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
      github?: string;
      website?: string;
    };
    summary: string;
    skills: string[];
    experience: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      gpa?: string;
    }>;
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
      link?: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
      credentialUrl?: string;
    }>;
  };
  atsScore?: number;
  atsAnalysis?: any;
  aiImprovements?: string[];
  isPublic: boolean;
  version: number;
  isDefault: boolean;
}

export interface ISavedJob extends Document {
  user: Schema.Types.ObjectId;
  job: Schema.Types.ObjectId;
  notes?: string;
  savedAt: Date;
}

export interface INotification extends Document {
  recipient: Schema.Types.ObjectId;
  sender?: Schema.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface IChat extends Document {
  participants: Schema.Types.ObjectId[];
  lastMessage?: {
    content: string;
    sender: Schema.Types.ObjectId;
    createdAt: Date;
  };
  unreadCount: Map<Schema.Types.ObjectId, number>;
  isArchived: Map<Schema.Types.ObjectId, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  chat: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  content: string;
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
  }>;
  isRead: boolean;
  readBy: Array<{
    user: Schema.Types.ObjectId;
    readAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterview extends Document {
  application: Schema.Types.ObjectId;
  job: Schema.Types.ObjectId;
  candidate: Schema.Types.ObjectId;
  recruiter: Schema.Types.ObjectId;
  type: "video" | "phone" | "in_person" | "assessment";
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  scheduledDate: Date;
  duration: number;
  meetingLink?: string;
  location?: string;
  notes?: string;
  feedback?: {
    rating: number;
    comments: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: "hire" | "no_hire" | "maybe";
    submittedBy: Schema.Types.ObjectId;
    submittedAt: Date;
  };
  aiQuestions?: string[];
  aiAnalysis?: any;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResumeTemplate extends Document {
  name: string;
  description: string;
  previewImage: string;
  template: string;
  category: string;
  isPremium: boolean;
  isPublic: boolean;
  createdBy: Schema.Types.ObjectId;
  usageCount: number;
}
