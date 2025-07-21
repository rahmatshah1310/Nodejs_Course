const FollowService = require("../services/follow.service");
const User = require("../model/user");

module.exports.followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    const targetUser = await User.findById(targetUserId);
    console.log(targetUser);
    if (!targetUser) {
      return res
        .status(404)
        .json({ message: "The user you are trying to follow does not exist " });
    }

    const result = await FollowService.followUser(userId, targetUserId);
    return res.status(200).json({
      status: "success",
      message: `You are following ${targetUser.userName}`,
    });
  } catch (error) {
    if (error.message === "You are already following this user") {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
    console.error("FollowController [followUser] Error", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports.unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    const targetUser = await User.findById(targetUserId);
    console.log(targetUser, "targetUser..........................");
    if (!targetUser) {
      return res.status(404).json({
        message: "The user you are trying to unfollow does not exist ",
      });
    }

    const result = await FollowService.unfollowUser(userId, targetUserId);
    return res.status(200).json({
      status: "success",
      message: `You are unfollowing ${targetUser.userName}`,
    });
  } catch (error) {
    if (error.message === "You are already unfollowing this user") {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
    console.error("FollowController [unfollow] Error", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports.getfollower = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "id in the followercontroller");
    const updateFollower = await FollowService.getfollowers(id);
    console.log(
      updateFollower,
      "updatefollower,........................................."
    );
    return res.status(200).json({
      message: "Get Follower Succesfully",
      data: updateFollower,
    });
  } catch (error) {
    console.error("FollowController [getfollower] Error", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
