const User = require("../model/user");

module.exports.savePost = async (userId, postId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (!user.savedPosts?.includes(postId)) {
    user.savedPosts?.push(postId);
    await user.save();
  }
  return user.savedPosts;
};

module.exports.unsavePost = async (userId, postId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User Not Found");
  }

  user.savedPosts.pull(postId);
  await user.save();
  return user.savedPosts;
};

module.exports.getSavedPosts = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "savedPosts",
    select:
      "caption imageUrls likeCount commentsCount createdAt postBy likes comments",
    populate: [
      {
        path: "postBy",
        select: "userName email fullName _id profilePic",
      },
      {
        path: "likes",
        select: "_id",
      },
      {
        path: "comments.user",
        select: "_id",
      },
    ],
  });

  const transformedPosts = user.savedPosts.map((post) => {
    const transformedLikes = post.likes.map((like) => like._id.toString());
    return {
      ...post.toObject(),
      likes: transformedLikes,
    };
  });

  return transformedPosts;
};
