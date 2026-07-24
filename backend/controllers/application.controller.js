import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import { sendApplicationEmail, sendApplicationStatusEmail } from "../services/email.service.js";

// @desc     Apply for a job
// @route    GET /api/application/apply/:id
// @access   Private
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Job ID is required", success: false });
    }

    // check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);

    await job.save();

    // Send application email notification
    const user = await User.findById(userId);
    const company = await job.populate('company');
    if (user && company) {
      sendApplicationEmail(user.email, user.fullName, job.title, company.company.name).catch(err => {
        console.log("Failed to send application email:", err);
      });
    }

    return res
      .status(201)
      .json({ message: "Application submitted successfully", success: true });
  } catch (error) {
    console.log("Error in apply job", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc     Get all applied jobs
// @route    GET /api/application/get
// @access   Private
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });
    if (!application) {
      return res
        .status(404)
        .json({ message: "No applications found", success: false });
    }

    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.log("Error in get applied jobs", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc     Get all applicants for a job
// @route    GET /api/application/:id/applicants
// @access   Private
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log("Error in getApplicants", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc     Update application status
// @route    POST /api/application/update-status/:id
// @access   Private
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res
        .status(400)
        .json({ message: "Status is required", success: false });
    }

    const application = await Application.findOne({ _id: applicationId });

    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found", success: false });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    // Send status update email notification
    const applicant = await User.findById(application.applicant);
    const job = await Job.findById(application.job).populate('company');
    if (applicant && job) {
      sendApplicationStatusEmail(
        applicant.email,
        applicant.fullName,
        job.title,
        job.company.name,
        status
      ).catch(err => {
        console.log("Failed to send status email:", err);
      });
    }

    return res
      .status(200)
      .json({
        message: "Application status updated successfully",
        success: true,
      });
  } catch (error) {
    console.log("Error in updateStatus", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
