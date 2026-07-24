import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ResumeTemplate",
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "My Resume",
  },
  content: {
    type: Object,
    required: true,
    // Resume content structure
    // {
    //   header: { name, email, phone, location, linkedin, github },
    //   summary: string,
    //   experience: [{ title, company, location, startDate, endDate, description }],
    //   education: [{ degree, institution, location, startDate, endDate, gpa }],
    //   skills: { technical: [], soft: [], tools: [] },
    //   projects: [{ name, description, technologies, link }],
    //   certifications: [{ name, issuer, date }],
    //   languages: [{ language, proficiency }]
    // }
  },
  version: {
    type: Number,
    default: 1,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  pdfUrl: {
    type: String,
    default: "",
  },
  pdfPublicId: {
    type: String,
    default: "",
  },
},
{
  timestamps: true
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
