import mongoose,{Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema =new Schema(
    {
       videoFile:{
            type:String,
             require:true,
       },
       thumbnail:{
            type:true,
            require:true,
       },
      title:{
            type:true,
            require:true,
       },
      description:{
           type:true,
           require:true,
       },
       duration:{
           type:true,
           require:true,
       },
       video:{
            type:Number,
           default:0,
       },
       ispublished:{
           type:Boolean,
            default:true,
       },
       owner:{
           type:Schema.Types.ObjectId,
           ref:"user",
       }
    },
    {
        timestamps:true,
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export  const Video = mongoose.model("Video",videoSchema);