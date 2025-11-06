const Follow = require("../model/follow.model");
const User = require("../model/user");
const Post = require("../model/post.model");

module.exports.getPostsFromFollowing = async (userId, limit) => {
  try {
    const followingUsers = await Follow.find({ follower: userId }).select(
      "following"
    );

    const followingIds = followingUsers.map((follow) => follow.following);

    if (followingIds.length === 0) {
      return [];
    }

    const size = parseInt(limit, 10) || 10;

    const posts = await Post.aggregate([
      { $match: { postBy: { $in: followingIds } } },
      { $sample: { size } },
      {
        $lookup: {
          from: "users",
          localField: "postBy",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          caption: 1,
          imageurls: 1,
          likeCount: 1,
          commentCount: 1,
          createdAt: 1,
          likes: 1,
          "user._id": 1,
          "user.userName": 1,
          "user.profilePic": 1,
        },
      },
    ]);

    return posts;
  } catch (error) {
    console.error("HomeService [getPostsFromFollowing] Error:", error);
    throw error;
  }
};
