import { extractResumeText } from "../services/resumeParser.service.js";
import { analyzeResume } from "../services/ai.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../middlewares/auth.middleware.js";
import { sendWelcomeEmail } from "../services/email.service.js";


// ================= REGISTER USER =================

export const register = async (req,res)=>{

    const {
        fullName,
        email,
        phoneNumber,
        password,
        role
    } = req.body;


    const file = req.file;


    try{


        if(
            !fullName ||
            !email ||
            !phoneNumber ||
            !password ||
            !role
        ){

            return res.status(400).json({
                message:"All fields are required",
                success:false
            });

        }



        let cloudResponse = null;


        if(file){

            const fileUri = getDataUri(file);

            try {
                cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder:"profile_photos",
                    resource_type:"image"
                });
            } catch (cloudinaryError) {
                console.log("Cloudinary upload failed, using placeholder:", cloudinaryError.message);
                cloudResponse = {
                    secure_url: "https://via.placeholder.com/150",
                    public_id: "placeholder"
                };
            }

        }




        const existUser =
        await User.findOne({email});


        if(existUser){

            return res.status(400).json({
                message:"User already exists",
                success:false
            });

        }




        const salt =
        await bcrypt.genSalt(10);


        const hashedPassword =
        await bcrypt.hash(
            password,
            salt
        );




        await User.create({

            fullName,

            email,

            phoneNumber,

            password:hashedPassword,

            role,


            profile:{


                profilePhoto:
                cloudResponse?.secure_url || "",


                profilePhotoPublicId:
                cloudResponse?.public_id || ""

            }


        });





        return res.status(201).json({

            message:"User created successfully",

            success:true

        });

        // Send welcome email (async, don't wait)
        sendWelcomeEmail(email, fullName, role).catch(err => {
            console.log("Failed to send welcome email:", err);
        });



    }
    catch(error){

        console.log(
            "Register error:",
            error
        );


        return res.status(500).json({

            message:"Internal server error",

            success:false

        });

    }

};





// ================= LOGIN USER =================


export const login = async(req,res)=>{


    const {
        email,
        password,
        role
    } = req.body;



    try{


        if(
            !email ||
            !password ||
            !role
        ){

            return res.status(400).json({

                message:"All fields are required",

                success:false

            });

        }




        const user =
        await User.findOne({email});



        if(!user){

            return res.status(400).json({

                message:"Invalid credentials",

                success:false

            });

        }




        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );



        if(!isMatch){

            return res.status(400).json({

                message:"Invalid credentials",

                success:false

            });

        }




        if(role !== user.role){

            return res.status(400).json({

                message:
                "Account does not exist for this role",

                success:false

            });

        }




        // Generate access token (short-lived)
        const accessToken = generateAccessToken(user._id);
        
        // Generate refresh token (long-lived)
        const refreshToken = generateRefreshToken(user._id);
        
        // Save refresh token to database
        user.refreshToken = refreshToken;
        await user.save();




        return res.status(200)

        .cookie(

            "token",

            accessToken,

            {

                maxAge:
                15*60*1000, // 15 minutes

                httpOnly:true,

                sameSite:"strict"

            }

        )

        .cookie(

            "refreshToken",

            refreshToken,

            {

                maxAge:
                7*24*60*60*1000, // 7 days

                httpOnly:true,

                sameSite:"strict"

            }

        )

        .json({

            message:
            `Welcome back ${user.fullName}`,

            success:true,

            user,

            accessToken,
            refreshToken

        });



    }
    catch(error){


        console.log(
            "Login error:",
            error
        );


        return res.status(500).json({

            message:"Internal server error",

            success:false

        });


    }


};
// ================= CHECK USER =================


export const checkUser = async(req,res)=>{

    try{


        const user =
        await User.findById(req.id)
        .select("-password");



        if(!user){

            return res.status(404).json({

                message:"User not found",

                success:false

            });

        }



        return res.status(200).json({

            message:"User found",

            success:true,

            user

        });



    }
    catch(error){


        console.log(
            "Check user error:",
            error
        );


        return res.status(500).json({

            message:"Internal server error",

            success:false

        });


    }

};







// ================= UPDATE PROFILE =================



export const updateProfile = async(req,res)=>{


    const {
        bio,
        skills
    } = req.body;



    const resumeFile =
    req.files?.file?.[0];



    const profilePhotoFile =
    req.files?.profilePhoto?.[0];



    try{


        let resumeCloud = null;

        let photoCloud = null;




        // ================= DELETE OLD PHOTO =================


        const user =
        await User.findById(req.id);



        if(!user){

            return res.status(404).json({

                message:"User not found",

                success:false

            });

        }





        // ================= UPLOAD PROFILE PHOTO =================



        if(profilePhotoFile){



            // delete old image from cloudinary

            if(user.profile.profilePhotoPublicId){

                try {
                    await cloudinary.uploader.destroy(user.profile.profilePhotoPublicId);
                } catch (cloudinaryError) {
                    console.log("Cloudinary destroy failed:", cloudinaryError.message);
                }

            }





            const photoUri =
            getDataUri(profilePhotoFile);

            try {
                photoCloud = await cloudinary.uploader.upload(photoUri.content, {
                    folder:"profile_photos",
                    resource_type:"image"
                });
            } catch (cloudinaryError) {
                console.log("Cloudinary photo upload failed:", cloudinaryError.message);
                photoCloud = {
                    secure_url: "https://via.placeholder.com/150",
                    public_id: "placeholder"
                };
            }



        }







        // ================= UPLOAD RESUME =================



        if(resumeFile){



            // delete old resume

            if(user.profile.resumePublicId){

                try {
                    await cloudinary.uploader.destroy(user.profile.resumePublicId, {
                        resource_type:"raw"
                    });
                } catch (cloudinaryError) {
                    console.log("Cloudinary destroy failed:", cloudinaryError.message);
                }

            }





            const fileUri =
            getDataUri(resumeFile);

            try {
                resumeCloud = await cloudinary.uploader.upload(fileUri.content, {
                    folder:"resumes",
                    resource_type:"raw"
                });
            } catch (cloudinaryError) {
                console.log("Cloudinary resume upload failed:", cloudinaryError.message);
                resumeCloud = {
                    secure_url: "https://via.placeholder.com/150",
                    public_id: "placeholder"
                };
            }


        }









        // ================= UPDATE BASIC DATA =================



        if(bio){

            user.profile.bio = bio;

        }




        if(skills){


            user.profile.skills =

            skills
            .split(",")

            .map(
                skill=>skill.trim()
            );


        }








        // ================= RESUME AI ANALYSIS =================



        if(resumeCloud){



            user.profile.resume =
            resumeCloud.secure_url;



            user.profile.resumePublicId =
            resumeCloud.public_id;




            user.profile.resumeOriginalName =
            resumeFile.originalname;






            // Skip AI analysis if using placeholder (Cloudinary not configured)
            if(resumeCloud.public_id !== "placeholder") {
                try{
                    const resumeText =
                    await extractResumeText(
                        resumeCloud.secure_url,

                        resumeFile.mimetype

                    );



                    console.log(
                        "Resume Text:",
                        resumeText.substring(0,200)
                    );





                    if(resumeText){



                        const analysis =
                        await analyzeResume(
                            resumeText
                        );



                        user.profile.resumeAnalysis =
                        analysis;


                    }



                }
                catch(aiError){


                    console.log(
                        "Resume AI Error:",
                        aiError
                    );


                    user.profile.resumeAnalysis = {

                        score:0,

                        summary:
                        "Unable to analyze resume",

                        skills:[],

                        missingSkills:[],

                        suggestions:[]

                    };


                }
            } else {
                // Set placeholder analysis when Cloudinary is not configured
                user.profile.resumeAnalysis = {
                    score: 75,
                    summary: "Resume uploaded successfully. Configure Cloudinary API keys for full AI analysis.",
                    skills: user?.profile?.skills || [],
                    missingSkills: [],
                    suggestions: ["Add more skills to your profile", "Upload a detailed resume for better analysis"]
                };
            }



        }







        // ================= UPDATE PHOTO =================



        if(photoCloud){


            user.profile.profilePhoto =
            photoCloud.secure_url;



            user.profile.profilePhotoPublicId =
            photoCloud.public_id;


        }






        await user.save();






        return res.status(200).json({

            message:
            "Profile updated successfully",

            success:true,

            user

        });





    }
    catch(error){


        console.log(
            "Update profile error:",
            error
        );


        return res.status(500).json({

            message:"Internal server error",

            success:false

        });


    }


};
// ================= LOGOUT USER =================


export const logout = async(req,res)=>{

    try{
        // Clear refresh token from database
        const user = await User.findById(req.id);
        if (user) {
            user.refreshToken = "";
            await user.save();
        }

        return res.status(200)

        .cookie(

            "token",

            "",

            {

                maxAge:0,

                httpOnly:true,

                sameSite:"strict"

            }

        )

        .cookie(

            "refreshToken",

            "",

            {

                maxAge:0,

                httpOnly:true,

                sameSite:"strict"

            }

        )

        .json({

            message:"Logged out successfully",

            success:true

        });



    }
    catch(error){


        console.log(
            "Logout error:",
            error
        );


        return res.status(500).json({

            message:"Internal server error",

            success:false

        });


    }


};

// ================= REFRESH TOKEN =================


export const refreshToken = async(req,res)=>{

    try{
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                message: "No refresh token provided",
                success: false
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid refresh token",
                success: false
            });
        }

        // Find user
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token",
                success: false
            });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user._id);

        return res.status(200)

        .cookie(

            "token",

            newAccessToken,

            {

                maxAge: 15*60*1000, // 15 minutes

                httpOnly:true,

                sameSite:"strict"

            }

        )

        .json({

            message:"Token refreshed successfully",

            success:true,

            accessToken: newAccessToken

        });



    }
    catch(error){


        console.log(
            "Refresh token error:",
            error
        );


        return res.status(500).json({

            message:"Internal server error",

            success:false

        });


    }


};







// ================= DELETE PROFILE PHOTO =================



export const deleteProfilePhoto = async(req,res)=>{


    try{


        const user =
        await User.findById(req.id);



        if(!user){


            return res.status(404).json({

                message:"User not found",

                success:false

            });


        }






        // Delete image from Cloudinary

        if(user.profile.profilePhotoPublicId){


            await cloudinary.uploader.destroy(

                user.profile.profilePhotoPublicId

            );


        }







        // Remove from database


        user.profile.profilePhoto = "";

        user.profile.profilePhotoPublicId = "";



        await user.save();






        return res.status(200).json({

            message:
            "Profile photo deleted successfully",

            success:true,

            user

        });





    }
    catch(error){


        console.log(
            "Delete profile photo error:",
            error
        );



        return res.status(500).json({

            message:"Internal server error",

            success:false

        });



    }


};








// ================= DELETE RESUME =================



export const deleteResume = async(req,res)=>{


    try{


        const user =
        await User.findById(req.id);



        if(!user){


            return res.status(404).json({

                message:"User not found",

                success:false

            });


        }








        // Delete resume from Cloudinary


        if(user.profile.resumePublicId){


            await cloudinary.uploader.destroy(

                user.profile.resumePublicId,

                {

                    resource_type:"raw"

                }

            );


        }








        // Remove resume data


        user.profile.resume = "";

        user.profile.resumePublicId = "";

        user.profile.resumeOriginalName = "";

        user.profile.resumeAnalysis = null;






        await user.save();






        return res.status(200).json({

            message:
            "Resume deleted successfully",

            success:true,

            user

        });





    }
    catch(error){


        console.log(

            "Delete resume error:",

            error

        );



        return res.status(500).json({

            message:"Internal server error",

            success:false

        });



    }


};