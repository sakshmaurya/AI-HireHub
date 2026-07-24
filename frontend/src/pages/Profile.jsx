import { Avatar, AvatarImage } from "../components/ui/avatar";
import Navbar from "../components/shared/Navbar";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Contact, Mail, Pen, MapPin, Calendar, FileText, Award, TrendingUp } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import AppliedJobsTable from "../components/AppliedJobsTable";
import UpdateProfileDialog from "../components/UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  useGetAppliedJobs();
  const [edit, setEdit] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const DEFAULT_PROFILE_PIC = "/icons/defaultProfilePic.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-purple-200">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || DEFAULT_PROFILE_PIC}
                    alt="profile"
                  />
                </Avatar>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="font-bold text-2xl md:text-3xl text-gray-900">{user?.fullName}</h1>
                <p className="text-gray-600 mt-1">{user?.profile?.bio || "No bio added yet"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-purple-100 text-purple-700">
                    {user?.role === "student" ? "Job Seeker" : "Recruiter"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setEdit(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Pen className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        >
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Profile Completion</p>
                <p className="text-3xl font-bold mt-1">85%</p>
              </div>
              <Award className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Skills</p>
                <p className="text-3xl font-bold mt-1">{user?.profile?.skills?.length || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Member Since</p>
                <p className="text-3xl font-bold mt-1">
                  {new Date(user?.createdAt).getFullYear()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Contact className="text-purple-600" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <Contact className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{user?.phoneNumber}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="text-purple-600" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length !== 0 ? (
              user?.profile?.skills.map((item, index) => (
                <Badge
                  key={index}
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 text-sm font-medium"
                >
                  {item}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </div>
        </motion.div>

        {/* Resume Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="text-purple-600" />
            Resume
          </h2>
          {user?.profile?.resume ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user?.profile?.resumeOriginalName || "Resume"}</p>
                  <p className="text-sm text-gray-500">Uploaded resume</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(user?.profile?.resume, '_blank')}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  View Resume
                </Button>
                <Button
                  onClick={() => setEdit(true)}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Update
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No resume uploaded yet</p>
              <Button
                onClick={() => setEdit(true)}
                className="mt-4 bg-purple-600 hover:bg-purple-700"
              >
                Upload Resume
              </Button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/saved-jobs")}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 border-purple-200"
            >
              <FileText className="w-6 h-6 text-purple-600" />
              <span>Saved Jobs</span>
            </Button>
            <Button
              onClick={() => navigate("/analytics/student")}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 border-blue-200"
            >
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span>Analytics</span>
            </Button>
            <Button
              onClick={() => navigate("/jobs")}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50 border-green-200"
            >
              <Award className="w-6 h-6 text-green-600" />
              <span>Browse Jobs</span>
            </Button>
          </div>
        </motion.div>

        {/* Applied Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="text-purple-600" />
            Applied Jobs
          </h2>
          <AppliedJobsTable />
        </motion.div>
      </div>
      <UpdateProfileDialog edit={edit} setEdit={setEdit} />
    </div>
  );
};

export default Profile;
