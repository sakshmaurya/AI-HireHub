import Company from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataURI.js";

// @desc    Register a company
// @route   POST /api/company/register
// @access  Private
export const registerCompany = async (req, res) => {
  const { companyName } = req.body;

  try {
    // check if company already registered
    const company = await Company.findOne({ name: companyName });
    if (company) {
      return res
        .status(400)
        .json({ message: "Company already registered", success: false });
    }

    // register company
    const newCompany = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      success: true,
      company: newCompany,
    });
  } catch (error) {
    console.log("Error in registering company", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get all companies created by a user
// @route   GET /api/company/get-company
// @access  Private
export const getCompany = async (req, res) => {
  try {
    const userId = req.id; // logged-in user
    const companies = await Company.find({ userId });
    if (!companies) {
      return res
        .status(404)
        .json({ message: "No companies found", success: false });
    }

    return res
      .status(200)
      .json({ message: "Found companies", success: true, companies });
  } catch (error) {
    console.log("Error in getCompany", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get company by ID
// @route   GET /api/company/get-company/:id
// @access  Private
export const getCompanyById = async (req, res) => {
  try {
    // Extract the company ID from the request parameters (URL)
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "Comany found", success: true, company });
  } catch (error) {
    console.log("Error in getCompanyById", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Update company data
// @route   PUT /api/company/update-company
// @access  Private
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    let cloudResponse = null;
    
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "company_logos",
        resource_type: "image"
      });
    }

    let logo = "";
    if (cloudResponse) {
      logo = cloudResponse.secure_url;
    }

    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }

    if (name) company.name = name;
    if (description) company.description = description;
    if (website) company.website = website;
    if (location) company.location = location;
    if (logo) company.logo = logo;

    await company.save();

    return res.status(200).json({
      message: "Company updated successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log("Error in update company", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Delete company
// @route   DELETE /api/company/delete-company
// @access  Private
export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }

    await company.deleteOne();

    return res
      .status(200)
      .json({ message: "Company deleted successfully", success: true });
  } catch (error) {
    console.log("Error in delete company", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
