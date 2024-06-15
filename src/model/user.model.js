import mongoose ,{Schema} from "mongoose";

import jwt from 'jsonwebtoken';

import bcrypt from "bcrypt";

const userSchema = new Schema(
    { 
        username:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            require:true,
            trim:true,
            index:true,
        },
        avtar:{
            String:true, //cloudinary url
            require:true,
        },
        coverimage:{
            String:true,//cloudinary url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            String:true,
            require:[true,'password is required'],
        },
        refreshToken:{
            type:String
        }

    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
})

//above pre middelware is use to encrypt password before save

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}


// below are jwt token
userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
           _id: this._id,
           email:this.email,
           username:this.username,
           fullName:this.fullName
       },
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
       }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
           _id: this._id,
       },
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
)
}


export const User = mongoose.model("User", userSchema);