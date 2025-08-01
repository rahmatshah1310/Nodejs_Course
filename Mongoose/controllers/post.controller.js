const PostService = require("../services/post.service");

module.exports.createPost = async (req, res) => {
  try {
    const imageUrls = req.files?.map((file) => file.path);
    if (!imageUrls || imageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    if (imageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "You can upload upto 10 images only" });
    }

    const newPost = await PostService.createPost({
      userId: req.user._id,
      imageUrls,
    });

    return res.status(201).json({
      message: "Post Created Succesfully",
      post: newPost,
    });
  } catch (error) {
    console.error("PostController [creatPost] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.updateCaption = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;

    if (!caption) {
      return res.status(400).json({ message: "Caption is required" });
    }
    const updatedPost = await PostService.updateCaption(
      id,
      req.user._id,
      caption
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    return res.status(200).json({
      message: "Caption updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("PostController [updateCaption] Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    let { caption, isPublic } = req.body;

    if (typeof isPublic !== "boolean") {
      return res.fail(
        "Invalid value for isPulic.It must be Boolean (true or false)"
      );
    }

    const updatePost = await PostService.updatePost(id, { caption, isPublic });
    if (!updatePost) {
      return res.fail("Post Not Found");
    }

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatePost,
    });
  } catch (error) {
    console.error("PostController [udpatePost] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await PostService.deletePost(id);
    return res.success("Post Deleted Succesfully");
  } catch (error) {
    console.error("PostService [deletePost] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getPostByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await PostService.getPostsByUser(userId);
    return res.success(posts);
  } catch (error) {
    console.error("PostController [getPostByUser] Error", error);
    return res.status(500).json({ message: "Internval Server Error" });
  }
};

module.exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostService.getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("PostController [getPostById] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const updatePost = await PostService.likePost(id, userId);

    if (!updatePost) {
      res.status(404).json({ message: "Post Not Found" });
    }
    res.status(200).json({
      message: "Post Liked Succesfully",
      likeCount: updatePost.likeCount,
    });
  } catch (error) {
    console.error("PostController [likePost] Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const updatePost = await PostService.dislikePost(id, userId);

    if (!updatePost) {
      res.status(404).json({ message: "Post Not Found" });
    }
    res.status(200).json({
      message: "Post DisLiked Succesfully",
      likeCount: updatePost.likeCount,
    });
  } catch (error) {
    console.error("PostController [dislike] Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = req.body;

    if (!comment) {
      return res.status(400).json({
        status: fail,
        message: "comment is required",
      });
    }

    const udpatePost = await PostService.addComment(id, req.user._id, comment);
    if (!udpatePost) {
      return res.status(404).json({
        message: "Post Not Found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Comment Added Succesfully",
    });
  } catch (error) {
    console.error("PostController [addComment] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getPostComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await PostService.getPostComments(id, page, limit);

    if (!comments) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found or no comment available",
      });
    }

    return res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (error) {
    console.error("PostController [getPostComments] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const updatePost = await PostService.deleteComment(postId, commentId);

    if (!updatePost) {
      return res.status(404).json({
        message: "Post or comment not found",
      });
    }

    return res.status(200).json({
      message: "Comment Deleted Succesfully",
      commentCount: updatePost.commentCount,
    });
  } catch (error) {
    console.error("PostController [deletecomment] Error", error);
    return res.status(500).jso({ message: "Internal Server Error" });
  }
};
