import React, { useEffect, useState } from "react";
import Navbar from "../components/shared/Navbar";
import { motion } from "framer-motion";
import { Bookmark, MapPin, IndianRupee, Briefcase, Clock, Trash2, Edit } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState("");

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/saved-job/get", {
        withCredentials: true,
      });
      if (response.data.success) {
        setSavedJobs(response.data.savedJobs);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (savedJobId) => {
    try {
      await axios.delete(`http://localhost:8000/api/saved-job/delete/${savedJobId}`, {
        withCredentials: true,
      });
      setSavedJobs(savedJobs.filter((job) => job._id !== savedJobId));
      toast.success("Job removed from saved");
    } catch (error) {
      console.error("Error deleting saved job:", error);
      toast.error("Failed to remove job");
    }
  };

  const handleUpdateNotes = async (savedJobId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/saved-job/update/${savedJobId}`,
        { notes: notesText },
        { withCredentials: true }
      );
      setSavedJobs(
        savedJobs.map((job) =>
          job._id === savedJobId ? { ...job, notes: notesText } : job
        )
      );
      setEditingNotes(null);
      toast.success("Notes updated successfully");
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Failed to update notes");
    }
  };

  const startEditing = (savedJob) => {
    setEditingNotes(savedJob._id);
    setNotesText(savedJob.notes || "");
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
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Bookmark className="text-blue-600" />
            Saved Jobs
          </h1>
          <p className="text-gray-600 mt-2">
            {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved for later
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Jobs</h3>
            <p className="text-gray-500">Start saving jobs you're interested in!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((savedJob, index) => (
              <motion.div
                key={savedJob._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {savedJob.job?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {savedJob.job?.company?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(savedJob._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      {savedJob.job?.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <IndianRupee className="w-4 h-4 mr-2 text-green-600" />
                      {parseInt(savedJob.job?.salary).toLocaleString("en-IN")}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2 text-purple-600" />
                      {savedJob.job?.jobType}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-orange-600" />
                      {savedJob.job?.experienceLevel}+ Years
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-gray-700">Notes</h4>
                      <button
                        onClick={() => startEditing(savedJob)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    {editingNotes === savedJob._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          rows="3"
                          placeholder="Add your notes..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateNotes(savedJob._id)}
                            className="flex-1 py-1 px-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotes(null)}
                            className="flex-1 py-1 px-3 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 italic">
                        {savedJob.notes || "No notes added"}
                      </p>
                    )}
                  </div>

                  {/* Apply Button */}
                  <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
