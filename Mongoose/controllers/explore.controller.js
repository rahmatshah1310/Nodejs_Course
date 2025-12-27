const ExploreService=require("../services/explore.service")

module.exports.getExplorePosts=async (req,res)=>{
    try {
        const {limit=10}=req.query;
        const userId=req.user._id;
        const posts=await ExploreService.getExplorePosts(limit,userId);

        return res.status(200).json({
            status:"success",
            data:posts,
        })    
    } catch (error) {
        console.error("ExploreController [getExplorePosts] Error",error);
        return res.status(500).json({
            status:"error",
            message:"An error occured while fetching posts"
        })
    }
}