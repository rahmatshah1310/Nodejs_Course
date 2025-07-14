const PostService=require('../services/post.service')

module.exports.createPost=async (req,res)=>{
    try {
        const imageUrls=req.files?.map((file)=>file.path);
        if(!imageUrls || imageUrls.length===0){
            return res.status(400).json({message:"At least one image is required"})
        }

        if(imageUrls.length===0){
            return res.status(400).json({message:"You can upload upto 10 images only"})
        }

        const newPost=await PostService.createPost({
            userId:req.user._id,
            imageUrls,
        })

        return res.status(201).json({
            message:"Post Created Succesfully",
            post:newPost,
        })
    } catch (error) {
        console.error("PostController [creatPost] Error", error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports.updateCaption=async (req,res)=>{
    try {
        const {id}=req.params;
        const {caption}=req.body;

        console.log(id,caption,"id and caption.......................................")

        if(!caption){
            return res.status(400).json({message:"Caption is required"})
        }

        const updatedPost=await PostService.updateCaption(id,req.user._id,caption)
        console.log(updatedPost,"updatedPost..................................")

        if(!updatedPost){
            return res.status(404).json({message:"Post Not Found or unauthorized"})
        }

        return res.status(200).json({
            message:"Caption updated Succesfully",
            post:updatedPost,
        })
    } catch (error) {
        console.error("PostController [updateCaption] Error",error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}