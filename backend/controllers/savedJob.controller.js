import SavedJob from "../models/savedJob.model.js";
import Job from "../models/job.model.js";

// @desc    Save a job
// @route   POST /api/saved-job/save
// @access  Private
export const saveJob = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId, notes } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Check if already saved
    const existingSavedJob = await SavedJob.findOne({
      user: userId,
      job: jobId,
    });

    if (existingSavedJob) {
      return res.status(400).json({
        message: "Job already saved",
        success: false,
      });
    }

    const savedJob = await SavedJob.create({
      user: userId,
      job: jobId,
      notes: notes || "",
    });

    return res.status(201).json({
      message: "Job saved successfully",
      success: true,
      savedJob,
    });
  } catch (error) {
    console.log("Error in save job", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// @desc    Get all saved jobs for a user
// @route   GET /api/saved-job/get
// @access  Private
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const savedJobs = await SavedJob.find({ user: userId })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      })
      .sort({ createdAt: -1 });

    if (!savedJobs || savedJobs.length === 0) {
      return res.status(404).json({
        message: "No saved jobs found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      savedJobs,
    });
  } catch (error) {
    console.log("Error in get saved jobs", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// @desc    Update saved job notes
// @route   PUT /api/saved-job/update/:id
// @access  Private
export const updateSavedJob = async (req, res) => {
  try {
    const { notes } = req.body;
    const savedJobId = req.params.id;
    const userId = req.id;

    const savedJob = await SavedJob.findById(savedJobId);

    if (!savedJob) {
      return res.status(404).json({
        message: "Saved job not found",
        success: false,
      });
    }

    // Check ownership
    if (savedJob.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }

    savedJob.notes = notes || "";
    await savedJob.save();

    return res.status(200).json({
      message: "Saved job updated successfully",
      success: true,
      savedJob,
    });
  } catch (error) {
    console.log("Error in update saved job", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// @desc    Delete a saved job
// @route   DELETE /api/saved-job/delete/:id
// @access  Private
export const deleteSavedJob = async (req, res) => {
  try {
    const savedJobId = req.params.id;
    const userId = req.id;

    const savedJob = await SavedJob.findById(savedJobId);

    if (!savedJob) {
      return res.status(404).json({
        message: "Saved job not found",
        success: false,
      });
    }

    // Check ownership
    if (savedJob.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }

    await SavedJob.findByIdAndDelete(savedJobId);

    return res.status(200).json({
      message: "Saved job deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in delete saved job", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// @desc    Check if a job is saved
// @route   GET /api/saved-job/check/:jobId
// @access  Private
export const checkSavedJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.jobId;

    const savedJob = await SavedJob.findOne({
      user: userId,
      job: jobId,
    });

    return res.status(200).json({
      success: true,
      isSaved: !!savedJob,
      savedJobId: savedJob?._id || null,
    });
  } catch (error) {
    console.log("Error in check saved job", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
