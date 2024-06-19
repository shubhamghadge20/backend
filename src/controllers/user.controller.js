import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req,res)=>{
     // 1.get user details from frontend
    // 2.validation - not empty
    // 3.check if user already exists: username, email
    // 4.check for images, check for avatar
    // 5.upload them to cloudinary, avatar
    // 6.create user object - create entry in db
    // 7.remove password and refresh token field from response
    // 8.check for user creation
    // 9.return res

    //step-1
      const {fullName,email,username,password}= req.body
      console.log("email:",email);

    //step-2
    if(
        [fullName,email,username,password].some((field)=>
        field?.trim() ==="")
    ){
       throw new ApiError(400,"All fields are rquired")
    }

    //step-4
    const existedUser = User.findOne({
        $or: [{ username },{ email}]
    })
        if(existedUser){
            throw new ApiError(409,"username and email already exits")
        }

    //step-5
    const avatarLocalPath =req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avtar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage =await uploadOnCloudinary(coverImageLocalPath)

    if(!avtar){
         throw new ApiError(400,"Avatar file is required")
    }

    //step-6

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
   })

   //step-7
   const createdUser = await user.findById(user._id).select(
    "-password -refreshToken"
   )

   //step-8
   if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
   }

   //step-9
   return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Successfully")
   )

})

export {
    registerUser,
}