import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details from frontend
    const { fullName, email, username, password } = req.body;
    console.log("email:", email);

    // 2. Validation - not empty
    if ([fullName, email, username, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existedUser) {
        throw new ApiError(409, "Username or email already exists");
    }

    // 4. Check for images, check for avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // 5. Upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Error uploading avatar");
    }

    // 6. Create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // 7. Remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // 8. Check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 9. Return response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export {
    registerUser,
};
