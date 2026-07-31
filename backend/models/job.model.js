import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    salary: {
      type: String,
      required: true,
    },
    salaryRange: {
      minSalary: {
        type: Number,
        default: 0
      },
      maxSalary: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: "INR"
      },
      perPeriod: {
        type: String,
        enum: ["hourly", "monthly", "yearly"],
        default: "yearly"
      }
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ["Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"]
    },
    location: {
      type: String,
      required: true,
    },
    locationType: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site"
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"]
    },
    positions: {
      type: String,
      required: true,
    },
    // Internship specific fields
    internshipDetails: {
      stipend: {
        type: String,
        default: ""
      },
      duration: {
        type: String,
        default: ""
      },
      perks: [{
        type: String
      }],
      offerLetter: {
        type: Boolean,
        default: false
      }
    },
    // Work from home specific
    isRemote: {
      type: Boolean,
      default: false
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    // Skill assessment
    requiredSkills: [{
      type: String
    }],
    skillAssessmentRequired: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
