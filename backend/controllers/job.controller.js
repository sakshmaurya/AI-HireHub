import Job from "../models/job.model.js";

// @desc    Post a job
// @route   POST /api/job/post
// @access  Private (Recruiter)
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      positions,
      companyId,
      // New fields
      minSalary,
      maxSalary,
      locationType,
      isRemote,
      requiredSkills,
      skillAssessmentRequired,
      // Internship specific
      stipend,
      duration,
      perks,
      offerLetter
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !positions ||
      !companyId
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const jobData = {
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(","),
      salary: String(salary),
      location,
      jobType,
      experienceLevel: experience,
      positions: Number(positions),
      company: companyId,
      createdBy: userId,
    };

    // Add new fields if provided
    if (minSalary || maxSalary) {
      jobData.salaryRange = {
        minSalary: Number(minSalary) || 0,
        maxSalary: Number(maxSalary) || 0,
        currency: "INR",
        perPeriod: "yearly"
      };
    }

    if (locationType) {
      jobData.locationType = locationType;
    }

    if (isRemote !== undefined) {
      jobData.isRemote = isRemote;
    }

    if (requiredSkills) {
      jobData.requiredSkills = Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(",");
    }

    if (skillAssessmentRequired !== undefined) {
      jobData.skillAssessmentRequired = skillAssessmentRequired;
    }

    // Internship specific fields
    if (jobType === "Internship") {
      jobData.internshipDetails = {
        stipend: stipend || "",
        duration: duration || "",
        perks: Array.isArray(perks) ? perks : (perks ? perks.split(",") : []),
        offerLetter: offerLetter || false
      };
    }

    const job = await Job.create(jobData);

    return res
      .status(201)
      .json({ message: "New job created successfully", success: true, job });
  } catch (error) {
    console.log("Error in posting job", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get all jobs
// @route   GET /api/job/get
// @access  Public
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    const jobType = req.query.jobType || "";
    const experienceLevel = req.query.experienceLevel || "";
    const minSalary = req.query.minSalary || 0;
    const maxSalary = req.query.maxSalary || Infinity;
    const locationType = req.query.locationType || "";
    const isRemote = req.query.isRemote;
    const requiredSkills = req.query.skills ? req.query.skills.split(",") : [];

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (minSalary || maxSalary) {
      query.salaryRange = {
        minSalary: { $gte: parseInt(minSalary) || 0 },
        maxSalary: { $lte: parseInt(maxSalary) === Infinity ? 1000000000 : parseInt(maxSalary) }
      };
    }

    if (locationType) {
      query.locationType = locationType;
    }

    if (isRemote === "true") {
      query.isRemote = true;
    }

    if (requiredSkills.length > 0) {
      query.requiredSkills = { $in: requiredSkills };
    }

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.log("Error in getting jobs", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get internships only
// @route   GET /api/job/internships
// @access  Public
export const getInternships = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    const minSalary = req.query.minSalary || 0;
    const maxSalary = req.query.maxSalary || Infinity;

    const query = {
      jobType: "Internship",
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (minSalary || maxSalary) {
      query.salaryRange = {
        minSalary: { $gte: parseInt(minSalary) || 0 },
        maxSalary: { $lte: parseInt(maxSalary) === Infinity ? 1000000000 : parseInt(maxSalary) }
      };
    }

    const internships = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, jobs: internships });
  } catch (error) {
    console.log("Error in getting internships", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get work from home jobs
// @route   GET /api/job/remote
// @access  Public
export const getRemoteJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const jobType = req.query.jobType || "";
    const experienceLevel = req.query.experienceLevel || "";

    const query = {
      isRemote: true,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    const remoteJobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, jobs: remoteJobs });
  } catch (error) {
    console.log("Error in getting remote jobs", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get job by ID
// @route   GET /api/job/get/:id
// @access  Private
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ success: true, job });
  } catch (error) {
    console.log("Error in getting job by ID", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get recruiter jobs
// @route   GET /api/job/get-recruiter-jobs
// @access  Private (Recruiter)
export const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.id;
    const jobs = await Job.find({ createdBy: recruiterId }).populate({
      path: "company",
      createdAt: -1,
    });

    if (!jobs) {
      return res
        .status(404)
        .json({ message: "Jobs not found", success: false });
    }

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.log("Error in getting recruiter jobs", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Delete a job
// @route   DELETE /api/job/delete/:id
// @access  Private (Recruiter)
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // Check if the user is the creator of the job
    if (job.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({ message: "Job deleted successfully", success: true });
  } catch (error) {
    console.log("Error in deleting job", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
