import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import Company from "../models/company.model.js";

// @desc    Get student analytics
// @route   GET /api/analytics/student
// @access  Private (Student)
export const getStudentAnalytics = async (req, res) => {
  try {
    const userId = req.id;

    // Total applications
    const totalApplications = await Application.countDocuments({ applicant: userId });

    // Applications by status
    const pendingApplications = await Application.countDocuments({
      applicant: userId,
      status: "pending",
    });
    const acceptedApplications = await Application.countDocuments({
      applicant: userId,
      status: "accepted",
    });
    const rejectedApplications = await Application.countDocuments({
      applicant: userId,
      status: "rejected",
    });

    // Recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentApplications = await Application.find({
      applicant: userId,
      createdAt: { $gte: thirtyDaysAgo },
    })
      .populate("job")
      .sort({ createdAt: -1 })
      .limit(5);

    // Application rate (applications per week)
    const applicationsPerWeek = await Application.aggregate([
      { $match: { applicant: userId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } },
      { $limit: 4 },
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        recentApplications,
        applicationsPerWeek,
        successRate: totalApplications > 0
          ? ((acceptedApplications / totalApplications) * 100).toFixed(2)
          : 0,
      },
    });
  } catch (error) {
    console.log("Error in get student analytics", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get recruiter analytics
// @route   GET /api/analytics/recruiter
// @access  Private (Recruiter)
export const getRecruiterAnalytics = async (req, res) => {
  try {
    const userId = req.id;

    // Total jobs posted
    const totalJobs = await Job.countDocuments({ createdBy: userId });

    // Total applications received
    const jobs = await Job.find({ createdBy: userId });
    const jobIds = jobs.map((job) => job._id);
    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    // Applications by status
    const pendingApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "pending",
    });
    const acceptedApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "accepted",
    });
    const rejectedApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "rejected",
    });

    // Recent applications
    const recentApplications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("job")
      .populate("applicant")
      .sort({ createdAt: -1 })
      .limit(5);

    // Jobs by status (active vs inactive based on applications)
    const jobsWithApplications = await Job.find({
      createdBy: userId,
      applications: { $exists: true, $ne: [] },
    }).countDocuments();

    // Company analytics
    const companies = await Company.find({ userId });
    const totalCompanies = companies.length;

    // Top performing jobs (most applications)
    const topJobs = await Job.find({ createdBy: userId })
      .sort({ applications: -1 })
      .limit(5)
      .populate("company");

    return res.status(200).json({
      success: true,
      analytics: {
        totalJobs,
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        recentApplications,
        jobsWithApplications,
        totalCompanies,
        topJobs,
        acceptanceRate: totalApplications > 0
          ? ((acceptedApplications / totalApplications) * 100).toFixed(2)
          : 0,
        avgApplicationsPerJob: totalJobs > 0
          ? (totalApplications / totalJobs).toFixed(2)
          : 0,
      },
    });
  } catch (error) {
    console.log("Error in get recruiter analytics", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get platform-wide analytics (Admin only)
// @route   GET /api/analytics/admin
// @access  Private (Admin)
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Job postings (last 30 days)
    const newJobs = await Job.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Applications (last 30 days)
    const newApplications = await Application.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications,
        totalCompanies,
        newUsers,
        newJobs,
        newApplications,
      },
    });
  } catch (error) {
    console.log("Error in get admin analytics", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
