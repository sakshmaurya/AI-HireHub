import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    fullName:{
        type:String,
        required:true,
    },


    email:{
        type:String,
        required:true,
        unique:true,
    },


    phoneNumber:{
        type:Number,
        required:true,
    },


    password:{
        type:String,
        required:true,
    },


    role:{
        type:String,
        enum:["student","recruiter","admin"],
        required:true,
    },


    // ================= REFRESH TOKEN =================
    refreshToken:{
        type:String,
        default:"",
    },



    profile:{


        bio:{
            type:String,
            default:"",
        },



        skills:[
            {
                type:String,
            }
        ],




        // ================= RESUME =================


        resume:{
            type:String,
            default:"",
        },


        // Cloudinary Resume Public ID
        resumePublicId:{
            type:String,
            default:"",
        },


        resumeOriginalName:{
            type:String,
            default:"",
        },




        // ================= AI RESUME ANALYSIS =================


        resumeAnalysis:{

            type:mongoose.Schema.Types.Mixed,

            default:{}

        },






        // ================= RECRUITER COMPANY =================


        company:{

            type:mongoose.Schema.Types.ObjectId,

            ref:"Company"

        },






        // ================= PROFILE PHOTO =================


        profilePhoto:{

            type:String,

            default:""

        },



        // Cloudinary Image Public ID

        profilePhotoPublicId:{

            type:String,

            default:""

        }




    }



},

{
    timestamps:true
}

);



const User = mongoose.model(
    "User",
    userSchema
);


export default User;