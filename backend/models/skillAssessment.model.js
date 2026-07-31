import mongoose from "mongoose";

const skillAssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Technical", "Soft Skills", "Domain Specific", "Programming"]
  },
  skills: [{
    type: String,
    required: true
  }],
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium"
    }
  }],
  duration: {
    type: Number,
    required: true,
    default: 30 // minutes
  },
  passingScore: {
    type: Number,
    required: true,
    default: 60 // percentage
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// User assessment result schema
const assessmentResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkillAssessment",
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  timeTaken: {
    type: Number,
    default: 0 // seconds
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const SkillAssessment = mongoose.model("SkillAssessment", skillAssessmentSchema);
export const AssessmentResult = mongoose.model("AssessmentResult", assessmentResultSchema);
