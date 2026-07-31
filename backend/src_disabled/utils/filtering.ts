import { FilterQuery } from 'mongoose';

export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: string;
  [key: string]: any;
}

export const buildSearchFilter = (
  searchFields: string[],
  searchTerm?: string
): FilterQuery<any> => {
  if (!searchTerm) return {};

  const regex = new RegExp(searchTerm, 'i');
  return {
    $or: searchFields.map((field) => ({ [field]: regex })),
  };
};

export const buildStatusFilter = (status?: string): FilterQuery<any> => {
  if (!status) return {};
  return { status };
};

export const buildCategoryFilter = (category?: string): FilterQuery<any> => {
  if (!category) return {};
  return { category };
};

export const buildLocationFilter = (location?: string): FilterQuery<any> => {
  if (!location) return {};
  const regex = new RegExp(location, 'i');
  return { location: regex };
};

export const buildJobTypeFilter = (jobType?: string): FilterQuery<any> => {
  if (!jobType) return {};
  return { jobType };
};

export const buildExperienceLevelFilter = (experienceLevel?: string): FilterQuery<any> => {
  if (!experienceLevel) return {};
  return { experienceLevel };
};

export const buildSalaryFilter = (
  salaryMin?: string,
  salaryMax?: string
): FilterQuery<any> => {
  const filter: FilterQuery<any> = {};
  
  if (salaryMin || salaryMax) {
    filter['salary.min'] = {};
    if (salaryMin) filter['salary.min'].$gte = parseInt(salaryMin);
    if (salaryMax) filter['salary.min'].$lte = parseInt(salaryMax);
  }
  
  return filter;
};

export const buildRemoteFilter = (remote?: string): FilterQuery<any> => {
  if (!remote) return {};
  return { remote: remote === 'true' };
};

export const buildDateRangeFilter = (
  startDate?: string,
  endDate?: string,
  field: string = 'createdAt'
): FilterQuery<any> => {
  const filter: FilterQuery<any> = {};
  
  if (startDate || endDate) {
    filter[field] = {};
    if (startDate) filter[field].$gte = new Date(startDate);
    if (endDate) filter[field].$lte = new Date(endDate);
  }
  
  return filter;
};

export const combineFilters = (...filters: FilterQuery<any>[]): FilterQuery<any> => {
  return filters.reduce((combined, filter) => {
    return { ...combined, ...filter };
  }, {});
};
