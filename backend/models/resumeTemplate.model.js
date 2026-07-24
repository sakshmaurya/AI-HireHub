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
    // Structure defines the layout and sections of the resume
    // Example: { sections: ["header", "summary", "experience", "education", "skills"], layout: "two-column" }
  },
  styles: {
    type: Object,
    default: {},
    // CSS styles for the template
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
},
{
  timestamps: true
});

const ResumeTemplate = mongoose.model("ResumeTemplate", resumeTemplateSchema);

export default ResumeTemplate;
<arg_value><arg_key>EmptyFile</arg_key><arg_value>false
