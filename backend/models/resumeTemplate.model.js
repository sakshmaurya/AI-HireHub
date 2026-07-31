import mongoose from "mongoose";

const resumeTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["professional", "creative", "modern", "minimal", "technical"],
    default: "professional",
  },
  thumbnail: {
    type: String,
    default: "",
  },
  structure: {
    type: Object,
    required: true,
  },
  styles: {
    type: Object,
    default: {},
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, {
  timestamps: true
});

const ResumeTemplate = mongoose.model("ResumeTemplate", resumeTemplateSchema);

export default ResumeTemplate;
