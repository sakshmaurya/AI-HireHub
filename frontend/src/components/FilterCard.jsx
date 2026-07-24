import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const filterData = [
  {
    filterType: "Location",
    array: ["Hyderabad", "Banglore", "Mumbai", "Chennai", "Pune", "Delhi", "Remote", "Noida", "Gurgaon"],
  },
  {
    filterType: "Job Type",
    array: ["Full-time", "Part-time", "Contract", "Internship"],
  },
  {
    filterType: "Experience Level",
    array: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 1000000]);
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    const filters = {
      keyword: selectedValue,
      location: selectedLocation,
      jobType: selectedJobType,
      experienceLevel: selectedExperience,
      minSalary: salaryRange[0],
      maxSalary: salaryRange[1],
    };
    dispatch(setSearchedQuery(filters));
  }, [selectedValue, selectedLocation, selectedJobType, selectedExperience, salaryRange]);

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-lg border border-gray-100">
      <h1 className="font-bold text-xl text-gray-800 mb-4">Filter Jobs</h1>
      <hr className="mb-4 border-gray-200" />
      
      {/* Search Keyword */}
      <div className="mb-4">
        <Label className="font-semibold text-gray-700 mb-2 block">Search</Label>
        <input
          type="text"
          placeholder="Search jobs..."
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <Label className="font-semibold text-gray-700 mb-2 block">Location</Label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {filterData[0].array.map((item, idx) => (
              <SelectItem key={idx} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Type Filter */}
      <div className="mb-4">
        <Label className="font-semibold text-gray-700 mb-2 block">Job Type</Label>
        <Select value={selectedJobType} onValueChange={setSelectedJobType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            {filterData[1].array.map((item, idx) => (
              <SelectItem key={idx} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experience Level Filter */}
      <div className="mb-4">
        <Label className="font-semibold text-gray-700 mb-2 block">Experience Level (Years)</Label>
        <Select value={selectedExperience} onValueChange={setSelectedExperience}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            {filterData[2].array.map((item, idx) => (
              <SelectItem key={idx} value={item}>{item}+ Years</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Salary Range Filter */}
      <div className="mb-4">
        <Label className="font-semibold text-gray-700 mb-2 block">
          Salary Range: ₹{salaryRange[0].toLocaleString()} - ₹{salaryRange[1].toLocaleString()}
        </Label>
        <Slider
          value={salaryRange}
          onValueChange={setSalaryRange}
          max={2000000}
          step={50000}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹0</span>
          <span>₹20L+</span>
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          setSelectedValue("");
          setSelectedLocation("");
          setSelectedJobType("");
          setSelectedExperience("");
          setSalaryRange([0, 1000000]);
        }}
        className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterCard;
