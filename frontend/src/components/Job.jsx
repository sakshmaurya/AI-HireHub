import React, { useState } from "react";
import { Button } from "./ui/button";
import { Bookmark, MapPin, IndianRupee, Briefcase, Clock, Building2 } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentDate = new Date();
    const timeDiff = currentDate - createdAt;
    return Math.floor(timeDiff / (24 * 60 * 60 * 1000));
  };

  const handleSaveJob = async () => {
    try {
      setIsSaving(true);
      const response = await axios.post(
        "http://localhost:8000/api/saved-job/save",
        { jobId: job._id },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsSaved(true);
        toast.success("Job saved successfully");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="p-6 rounded-2xl shadow-lg bg-white border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : daysAgoFunction(job?.createdAt) + " days ago"}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSaveJob}
          disabled={isSaving}
          className={`rounded-full hover:bg-purple-50 ${isSaved ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          {job?.company?.logo ? (
            <Avatar className="w-10 h-10">
              <AvatarImage src={job?.company?.logo} />
            </Avatar>
          ) : (
            <Building2 className="w-6 h-6 text-purple-600" />
          )}
        </div>
        <div>
          <h1 className="font-semibold text-lg text-gray-800">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job?.location}
          </p>
        </div>
      </div>

      {/* Job Title */}
      <div className="mb-4">
        <h1 className="font-bold text-xl text-gray-900 mb-2">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium px-3 py-1">
          {job?.positions} Positions
        </Badge>
        <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-100 font-medium px-3 py-1">
          {job?.jobType}
        </Badge>
        <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium px-3 py-1">
          {job?.experienceLevel}+ Years
        </Badge>
      </div>

      {/* Salary */}
      <div className="flex items-center gap-2 mb-4 text-green-600 font-semibold">
        <IndianRupee className="w-4 h-4" />
        <span>{parseInt(job?.salary).toLocaleString("en-IN")} LPA</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(`/description/${job._id}`)}
          className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          View Details
        </Button>
        <Button
          onClick={handleSaveJob}
          disabled={isSaving || isSaved}
          className={`flex-1 ${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'}`}
        >
          {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Job'}
        </Button>
      </div>
    </motion.div>
  );
};

export default Job;
