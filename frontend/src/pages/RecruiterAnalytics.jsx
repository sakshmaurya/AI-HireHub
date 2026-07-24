import React, { useEffect, useState } from "react";
import Navbar from "../components/shared/Navbar";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  TrendingUp,
  Calendar,
  Star,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${bgColor} rounded-xl p-6 shadow-lg`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
      </div>
      <div className={`${color} bg-white/20 p-3 rounded-full`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

const RecruiterAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/analytics/recruiter", {
        withCredentials: true,
      });
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-8 px-4 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your hiring performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            title="Total Jobs"
            value={analytics?.totalJobs || 0}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={Users}
            title="Total Applications"
            value={analytics?.totalApplications || 0}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={analytics?.pendingApplications || 0}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={CheckCircle}
            title="Hired"
            value={analytics?.acceptedApplications || 0}
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Building2}
            title="Companies"
            value={analytics?.totalCompanies || 0}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
          />
          <StatCard
            icon={FileText}
            title="Jobs with Applications"
            value={analytics?.jobsWithApplications || 0}
            color="text-teal-600"
            bgColor="bg-teal-50"
          />
          <StatCard
            icon={TrendingUp}
            title="Avg Applications/Job"
            value={analytics?.avgApplicationsPerJob || 0}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>

        {/* Acceptance Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-purple-600" />
              Acceptance Rate
            </h3>
            <span className="text-3xl font-bold text-purple-600">
              {analytics?.acceptanceRate || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${analytics?.acceptanceRate || 0}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Top Performing Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="text-yellow-600" />
            Top Performing Jobs
          </h3>
          {analytics?.topJobs?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No jobs posted yet</p>
          ) : (
            <div className="space-y-4">
              {analytics?.topJobs?.map((job, index) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{job.title}</p>
                      <p className="text-sm text-gray-600">{job.company?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {job.applications?.length || 0}
                    </p>
                    <p className="text-xs text-gray-600">applications</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Recent Applications
          </h3>
          {analytics?.recentApplications?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent applications</p>
          ) : (
            <div className="space-y-4">
              {analytics?.recentApplications?.map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {app.applicant?.fullName}
                      </p>
                      <p className="text-sm text-gray-600">{app.job?.title}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : app.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterAnalytics;
