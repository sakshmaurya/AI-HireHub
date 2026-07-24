import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import { extractResumeText } from "../services/resumeParser.service.js";
import { 
  analyzeResume as analyzeResumeAI, 
  generateInterviewQuestions,
  getJobRecommendations,
  generateCoverLetter,
  rankCandidates
} from "../services/ai.service.js";

export const analyzeResume = async (req, res) => {
  try {
    const userId = req.id;
    const { jobDescription } = req.body;

    // Find logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check resume exists
    if (!user.profile.resume) {
      return res.status(400).json({
        message: "Please upload resume first",
        success: false,
      });
    }

    // Extract resume text
    const resumeText = await extractResumeText(
      user.profile.resume,
      user.profile.resumeOriginalName?.endsWith('.pdf') ? 'application/pdf' : 
      user.profile.resumeOriginalName?.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
      'application/pdf'
    );

    // Analyze resume with AI (with optional job description for matching)
    const analysis = await analyzeResumeAI(resumeText, jobDescription || "");

    // Update user with analysis
    user.profile.resumeAnalysis = analysis;
    await user.save();

    return res.status(200).json({
      message: "Resume analyzed successfully",
      success: true,
      analysis,
    });

  } catch (error) {
    console.log("Resume analysis error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getInterviewQuestions = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.id;

    // Find job
    const job = await Job.findById(jobId).populate('company');
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Check if user is the recruiter who posted the job
    if (job.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission to access this resource",
        success: false,
      });
    }

    // Get candidate resume if provided
    let candidateResume = "";
    const { candidateId } = req.body;
    if (candidateId) {
      const candidate = await User.findById(candidateId);
      if (candidate && candidate.profile.resume) {
        candidateResume = await extractResumeText(
          candidate.profile.resume,
          candidate.profile.resumeOriginalName?.endsWith('.pdf') ? 'application/pdf' : 
          candidate.profile.resumeOriginalName?.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
          'application/pdf'
        );
      }
    }

    // Generate interview questions
    const questions = await generateInterviewQuestions(
      job.title,
      job.description + "\n\nRequirements: " + job.requirements,
      candidateResume
    );

    return res.status(200).json({
      message: "Interview questions generated successfully",
      success: true,
      questions,
    });

  } catch (error) {
    console.log("Interview questions generation error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.id;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Get user skills and experience
    const skills = user.profile?.skills || [];
    const experience = user.profile?.bio || "0 years";
    const education = user.profile?.resumeAnalysis?.education?.[0]?.degree || "Not specified";

    // Get job recommendations
    const recommendations = await getJobRecommendations(skills, experience, education);

    return res.status(200).json({
      message: "Job recommendations generated successfully",
      success: true,
      recommendations,
    });

  } catch (error) {
    console.log("Job recommendations error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const generateCoverLetterForJob = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Find job
    const job = await Job.findById(jobId).populate('company');

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Generate cover letter
    const coverLetter = await generateCoverLetter(
      user.fullName,
      user.profile?.skills || [],
      user.profile?.bio || "",
      job.title,
      job.company?.name || "Company",
      job.description
    );

    return res.status(200).json({
      message: "Cover letter generated successfully",
      success: true,
      coverLetter,
    });

  } catch (error) {
    console.log("Cover letter generation error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const rankJobCandidates = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Check if user is the recruiter who posted the job
    if (job.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission to access this resource",
        success: false,
      });
    }

    // Get all applications for this job
    const applications = await Application.find({ job: jobId }).populate('applicant');

    if (!applications || applications.length === 0) {
      return res.status(200).json({
        message: "No candidates found for this job",
        success: true,
        rankings: [],
      });
    }

    // Extract candidates
    const candidates = applications.map(app => app.applicant);

    // Rank candidates using AI
    const rankings = await rankCandidates(
      job.description + "\n\nRequirements: " + job.requirements,
      candidates
    );

    return res.status(200).json({
      message: "Candidates ranked successfully",
      success: true,
      rankings,
    });

  } catch (error) {
    console.log("Candidate ranking error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};