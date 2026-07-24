import React, { useEffect, useState } from "react";
import Navbar from "../components/shared/Navbar";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Briefcase,
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

const StudentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/analytics/student", {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-8 px-4 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Analytics</h1>
          <p className="text-gray-600 mt-2">Track your job application progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FileText}
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
            title="Accepted"
            value={analytics?.acceptedApplications || 0}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={XCircle}
            title="Rejected"
            value={analytics?.rejectedApplications || 0}
            color="text-red-600"
            bgColor="bg-red-50"
          />
        </div>

        {/* Success Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Success Rate
            </h3>
            <span className="text-3xl font-bold text-blue-600">
              {analytics?.successRate || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${analytics?.successRate || 0}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-purple-600" />
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
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{app.job?.title}</p>
                      <p className="text-sm text-gray-600">{app.job?.company?.name}</p>
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

        {/* Application Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-600" />
            Applications per Week
          </h3>
          {analytics?.applicationsPerWeek?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {analytics?.applicationsPerWeek?.map((week, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-24">
                    Week {week._id.week}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(week.count * 10, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-8">
                    {week.count}
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

export default StudentAnalytics;
