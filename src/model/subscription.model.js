import mongoose,{Schema} from "mongoose";

const subscriptioSchema = new Schema({
       subscriber:{
        //one who is subscribing
          type:Schema.Types.ObjectId,
          ref:"User"
         },
         channel:{
            type:Schema.Types.ObjectId,
          ref:"User"
         }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription")