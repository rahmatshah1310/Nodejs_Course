const Post=require("../model/post.model")

module.exports.getExplorePosts=async(limit,userId)=>{
    try {
        const posts=await Post.aggregate([
            {
                 $match:{
                postBy:{$ne:userId},
            },
            },
              {$sample:{size:parseInt(limit,10)}},
             {
                $lookup:{
                    from :"users",  
                    localField:"postBy",
                    foreignField:"_id",
                    as:"user",
                },

            },
             {
                $unwind:"$user",
            },
              {
                $project:{
                    _id:1,
                    imageUrl:1,
                    caption:1,
                    likeCount:1,
                    likes:1,
                    commentCount:1,
                    createdAt:1,
                    "user._id":1,
                    "user.username":1,
                    "user.profilePic":1,
                },
            },

        ])

        return posts;
    } catch (error) {
        console.error("ExploreService [getExplorePost] Error",error);
        throw error;
    }
}
        