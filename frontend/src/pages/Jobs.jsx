import React, { useEffect, useState } from "react";
import FilterCard from "../components/FilterCard";
import Navbar from "../components/shared/Navbar";
import Job from "../components/Job";
import { useSelector, useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import axios from "axios";
import { motion } from "framer-motion";

const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [loading, setLoading] = useState(false);

  // Reset filter when page mounts
  useEffect(() => {
    dispatch(setSearchedQuery({}));
  }, []);

  // Fetch jobs with filters
  useEffect(() => {
    const fetchFilteredJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchedQuery?.keyword) params.append('keyword', searchedQuery.keyword);
        if (searchedQuery?.location) params.append('location', searchedQuery.location);
        if (searchedQuery?.jobType) params.append('jobType', searchedQuery.jobType);
        if (searchedQuery?.experienceLevel) params.append('experienceLevel', searchedQuery.experienceLevel);
        if (searchedQuery?.minSalary) params.append('minSalary', searchedQuery.minSalary);
        if (searchedQuery?.maxSalary) params.append('maxSalary', searchedQuery.maxSalary);

        const response = await axios.get(`http://localhost:8000/api/job/get?${params.toString()}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setFilterJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching filtered jobs:", error);
        // Fallback to client-side filtering if API fails
        if (searchedQuery) {
          const filteredJobs = allJobs.filter((job) => {
            const matchKeyword = !searchedQuery.keyword || 
              job.title.toLowerCase().includes(searchedQuery.keyword?.toLowerCase()) ||
              job.description.toLowerCase().includes(searchedQuery.keyword?.toLowerCase());
            
            const matchLocation = !searchedQuery.location || 
              job.location.toLowerCase().includes(searchedQuery.location.toLowerCase());
            
            const matchJobType = !searchedQuery.jobType || 
              job.jobType === searchedQuery.jobType;
            
            const matchExperience = !searchedQuery.experienceLevel || 
              job.experienceLevel <= parseInt(searchedQuery.experienceLevel);
            
            const matchSalary = (!searchedQuery.minSalary && !searchedQuery.maxSalary) ||
              (parseInt(job.salary) >= (searchedQuery.minSalary || 0) && 
               parseInt(job.salary) <= (searchedQuery.maxSalary || Infinity));
            
            return matchKeyword && matchLocation && matchJobType && matchExperience && matchSalary;
          });
          setFilterJobs(filteredJobs);
        } else {
          setFilterJobs(allJobs);
        }
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(searchedQuery || {}).length > 0) {
      fetchFilteredJobs();
    } else {
      setFilterJobs(allJobs);
    }
  }, [searchedQuery, allJobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-8 px-4 pb-8">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-1/4">
            <FilterCard />
          </div>

          {/* Job Listings */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {filterJobs.length} {filterJobs.length === 1 ? 'Job' : 'Jobs'} Found
              </h1>
              <p className="text-gray-600 mt-2">Discover your next career opportunity</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filterJobs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white rounded-2xl shadow-lg"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterJobs.map((job, index) => (
                  <motion.div
                    key={job?._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
