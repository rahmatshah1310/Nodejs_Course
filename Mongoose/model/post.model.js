const mongoose=require("mongoose");

const postShema=new mongoose.Schema({
    postBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    caption:{
        type:String,
        default:null
    },
    imageUrls:[
        {
            type:String,
            required:true,
        }
    ],
    // likes:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"User",
    // }],
    // likeCount:{
    //     type:Number,
    //     default:0
    // },
    // commentCount:{
    //     type:Number,
    //     default:0
    // },
    isPublic:{
        type:Boolean,
        default:true,
    },
    // comments:{
    //     user:{
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:"User",
    //         required:true,
    //     },
    //     comments:{
    //         type:String,
    //         required:true,
    //     },
    //     createdAt:{
    //         type:Date,
    //         default:Date.now,
    //     }
    // }
},
{timestamps:true}
)

module.exports=mongoose.model("Post",postShema)