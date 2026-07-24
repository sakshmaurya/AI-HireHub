import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import toast from "react-hot-toast";

const JobDescription = () => {
  const params = useParams(); // to get job ID from url parameters
  const jobId = params.id;
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  // .some() return true if the condition is present in the array
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true); // update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps to real time UI update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // useEffect(() => {
  //   const fetchSingleJobs = async () => {
  //     try {
  //       const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
  //         withCredentials: true,
  //       });
  //       if (res.data.success) {
  //         dispatch(setSingleJob(res.data.job));
  //         setIsApplied(
  //           res.data.job.applications.some(
  //             (application) => application.applicant === user._id
  //           )
  //         ); // ensure the state is in sync with the fetched data
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchSingleJobs();
  // }, [jobId, dispatch, user?._id]);

  useEffect(() => {
    dispatch(setSingleJob(null)); // optional: clear previous job data
    const fetchSingleJobs = async () => {
      try {
        console.log("Fetching job for ID:", jobId);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        console.log("Response from backend:", res.data);

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user._id
            )
          );
        }
      } catch (error) {
        console.error("Error while fetching single job:", error);
      }
    };
    fetchSingleJobs();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge className="text-blue-700 font-bold" variant="ghost">
              {singleJob?.positions} Openings
            </Badge>
            <Badge className="text-[#F83002] font-bold" variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className="text-[#7209B7] font-bold" variant="ghost">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied ? "bg-gray-600" : "bg-[#7209B7] hover:bg-[#9472ce]"
          }`}
        >
          {isApplied ? "Already applied" : "Apply now"}
        </Button>
      </div>
      <h1 className="border-b-2 border-b-gary-300 font-medium py-2">
        Job Description
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1">
          Job type:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.jobType}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experienceLevel} years
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary} LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted on:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
