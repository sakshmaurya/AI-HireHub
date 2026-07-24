import Resume from "../models/resume.model.js";
import ResumeTemplate from "../models/resumeTemplate.model.js";
import User from "../models/user.model.js";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";

// Create a new resume
export const createResume = async (req, res) => {
  try {
    const userId = req.id;
    const { templateId, title, content } = req.body;

    // Validate required fields
    if (!templateId || !content) {
      return res.status(400).json({
        message: "Template ID and content are required",
        success: false,
      });
    }

    // Check if template exists
    const template = await ResumeTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({
        message: "Template not found",
        success: false,
      });
    }

    // Check if user has reached the limit of resumes (e.g.,_max 5 resumes)
    const resumeCount = await Resume.countDocuments({ user: userId });
    if (resumeCount >= 5) {
      return res.status(400).json({
        message: "Maximum resume limit reached (5 resumes)",
        success: false,
      });
    }

    // Create resume
    const resume = await Resume.create({
      user: userId,
      template: templateId,
      title: title || "My Resume",
      content,
      version: 1,
    });

    return res.status(201).json({
      message: "Resume created successfully",
      success: true,
      resume,
    });
  } catch (error) {
    console.log("Create resume error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get all resumes for a user
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.id;

    const resumes = await Resume.find({ user: userId })
      .populate("template")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Resumes fetched successfully",
      success: true,
      resumes,
    });
  } catch (error) {
    console.log("Get user resumes error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get a single resume by ID
export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.id;

    const resume = await Resume.findById(resumeId).populate("template");

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
        success: false,
      });
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission to access this resume",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Resume fetched successfully",
      success: true,
      resume,
    });
  } catch (error) {
    console.log("Get resume error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Update a resume
export const updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.id;
    const { title, content, templateId } = req.body;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
        success: false,
      });
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission to update this resume",
        success: false,
      });
    }

    // Update fields
    if (title) resume.title = title;
    if (content) resume.content = content;
    if (templateId) {
      const template = await ResumeTemplate.findById(templateId);
      if (!template) {
        return res.status(404).json({
          message: "Template not found",
          success: false,
        });
      }
      resume.template = templateId;
    }

    // Increment version
    resume.version += 1;

    await resume.save();

    return res.status(200).json({
      message: "Resume updated successfully",
      success: true,
      resume,
    });
  } catch (error) {
    console.log("Update resume error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.id;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
        success: false,
      });
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission to delete this resume",
        success: false,
      });
    }

    // Delete PDF from Cloudinary if exists
    if (resume.pdfPublicId) {
      await cloudinary.uploader.destroy(resume.pdfPublicId, {
        resource_type: "raw",
      });
    }

    await Resume.findByIdAndDelete(resumeId);

    return res.status(200).json({
      message: "Resume deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Delete resume error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Set resume as default
export const setDefaultResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.id;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
        success: false,
      });
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission to update this resume",
        success: false,
      });
    }

    // Unset all other resumes as default
    await Resume.updateMany(
      { user: userId },
      { isDefault: false }
    );

    // Set this resume as default
    resume.isDefault = true;
    await resume.save();

    // Update user's profile resume
    const user = await User.findById(userId);
    if (user) {
      user.profile.resume = resume.pdfUrl || "";
      user.profile.resumePublicId = resume.pdfPublicId || "";
      user.profile.resumeOriginalName = `${resume.title}.pdf`;
      await user.save();
    }

    return res.status(200).json({
      message: "Default resume set successfully",
      success: true,
      resume,
    });
  } catch (error) {
    console.log("Set default resume error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get all resume templates
export const getTemplates = async (req, res) => {
  try {
    const templates = await ResumeTemplate.find({ isDefault: true })
      .sort({ category: 1, name: 1 });

    return res.status(200).json({
      message: "Templates fetched successfully",
      success: true,
      templates,
    });
  } catch (error) {
    console.log("Get templates error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get a single template by ID
export const getTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await ResumeTemplate.findById(templateId);

    if (!template) {
      return res.status(404).json({
        message: "Template not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Template fetched successfully",
      success: true,
      template,
    });
  } catch (error) {
    console.log("Get template error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Duplicate a resume (create a new version)
export const duplicateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.id;

    const originalResume = await Resume.findById(resumeId).populate("template");

    if (!originalResume) {
      return res.status(404).json({
        message: "Resume not found",
        success: false,
      });
    }

    // Check if user owns the resume
    if (originalResume.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission to duplicate this resume",
        success: false,
      });
    }

    // Check if user has reached the limit
    const resumeCount = await Resume.countDocuments({ user: userId });
    if (resumeCount >= 5) {
      return res.status(400).json({
        message: "Maximum resume limit reached (5 resumes)",
        success: false,
      });
    }

    // Create duplicate
    const duplicateResume = await Resume.create({
      user: userId,
      template: originalResume.template._id,
      title: `${originalResume.title} (Copy)`,
      content: originalResume.content,
      version: originalResume.version + 1,
    });

    return res.status(201).json({
      message: "Resume duplicated successfully",
      success: true,
      resume: duplicateResume,
    });
  } catch (error) {
    console.log("Duplicate resume error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
