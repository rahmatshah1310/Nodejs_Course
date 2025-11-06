const Post = require("../model/post.model");
const User = require("../model/user");
const cloudinary = require("../config/cloudinary.config");

module.exports.createPost = async ({ userId, imageUrls }) => {
  try {
    const newPost = new Post({
      postBy: userId,
      imageUrls,
    });

    await newPost.save();

    await User.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id },
      $inc: { postCount: 1 },
    });

    return newPost;
  } catch (error) {
    console.error("PostService [createPost] Error", error);
    throw error;
  }
};

module.exports.updateCaption = async (postId, userId, caption) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId, postBy: userId },
      { caption },
      { new: true }
    );
    return post;
  } catch (error) {
    console.error("PostService [updateCaption] Error", error);
    throw error;
  }
};

module.exports.updatePost = async (postId, data) => {
  try {
    const updatePost = await Post.findByIdAndUpdate(postId, data, {
      new: true,
    });
    return updatePost;
  } catch (error) {
    console.error("PostService [updatePost] Error", error);
    throw error;
  }
};

module.exports.deletePost = async (postId) => {
  try {
    const post = await Post.findById(postId).populate("postBy", "email");
    if (!post) {
      return null;
    }

    const userEmail = post.postBy.email;
    for (const imageUrl of post.imageUrls) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      const cloudinaryPath = `instagram-backend/${userEmail}/post-images/${publicId}`;
      console.log("Deleting from Cloudinary:", cloudinaryPath);

      await cloudinary.uploader.destroy(cloudinaryPath);
    }

    await User.findByIdAndUpdate(post.postBy._id, {
      $pull: { posts: postId },
      $inc: { postCount: -1 },
    });

    await Post.findByIdAndDelete(postId);
    return "Post Deleted Succesfully";
  } catch (error) {
    console.error("PostService [deletePost] Error", error);
    throw error;
  }
};

module.exports.getPostsByUser = async (userId) => {
  try {
    const posts = await Post.find({ postBy: userId }).populate().lean();
    return posts;
  } catch (error) {
    console.error("PostService [getPostsByUser] Error", error);
    throw error;
  }
};

module.exports.getPostById = async (postId) => {
  try {
    const singlePost = await Post.findById(postId).populate();
    return singlePost;
  } catch (error) {
    console.error("PostService [getPostById] Error", error);
    throw error;
  }
};

module.exports.likePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post Not Found");
    }

    if (post.likes.includes(userId)) {
      return post;
    }
    const updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: userId },
        $inc: { likeCount: 1 },
      },
      { new: true }
    );

    if (!updatePost) {
      throw new Error("Post update failed");
    }
    return updatePost;
  } catch (error) {
    console.error("Error in likePost", error);
    throw error;
  }
};

module.exports.dislikePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post Not Found");
    }

    if (!post.likes.includes(userId)) {
      return post;
    }
    const updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: userId },
        $inc: { likeCount: -1 },
      },
      { new: true }
    );
    if (!updatePost) {
      throw new Error("Post update failed");
    }
    return updatePost;
  } catch (error) {
    console.error("Error in dislikePost", error);
    throw error;
  }
};

module.exports.addComment = async (postId, userId, comment) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post Not Found");
  }

  post.comments.push({
    user: userId,
    comment: typeof comment === "string" ? comment : comment.comment,
    createdAt: new Date(),
  });

  post.commentCount += 1;
  await post.save();

  return post;
};

module.exports.getPostComments = async (postId, page, limit) => {
  try {
    const post = await Post.findById(postId)
      .populate({
        path: "comments.user",
        select: "userName profilePic",
      })
      .select("comments");

    if (!post) {
      return null;
    }
    const totalComments = post.comments.length;
    const paginatedComments = post.comments
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice((page - 1) * limit, page * limit);

    return {
      totalComments,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalComments / limit),
      comments: paginatedComments,
    };
  } catch (error) {
    console.error("PostService [getPostComments] Error", error);
    throw error;
  }
};

module.exports.deleteComment = async (postId, commentId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post Not Found");
  }

  const commentsIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === commentId.toString()
  );
  if (commentsIndex !== -1) {
    post.comments.splice(commentsIndex, 1),
      (post.commentCount = Math.max(0, post.commentCount - 1));
    await post.save();
    return post;
  }
};
