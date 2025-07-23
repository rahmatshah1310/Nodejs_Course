const FollowService = require("../services/follow.service");
const User = require("../model/user");

module.exports.followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    const targetUser = await User.findById(targetUserId);
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
    const userId = req.user._id;
    const followers = await FollowService.getfollowers(userId);
    return res.status(200).json({
      message: "Get Follower Succesfully",
      data: followers,
    });
  } catch (error) {
    console.error("FollowController [getfollower] Error", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports.getfollowing = async (req, res) => {
  try {
    const userId = req.user._id;
    const following = await FollowService.getfollowing(userId);
    return res.status(200).json({
      message: "Get following Succesfully",
      data: following,
    });
  } catch (error) {
    console.error("FollowController [getfollowing] Error", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports.getfollowerofUser = async (req, res) => {
  try {
    const { id } = req.params;
    const followers = await FollowService.getfollowersofAnotherUser(id);
    return res.status(200).json({
      message: "Get Follower Succesfully",
      data: followers,
    });
  } catch (error) {
    console.error("FollowController [getfollowerofUser] Error", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports.getfollowingofUser = async (req, res) => {
  try {
    const { id } = req.params;
    const following = await FollowService.getfollowingofAnotherUser(id);
    return res.status(200).json({
      message: "Get following Succesfully",
      data: following,
    });
  } catch (error) {
    console.error("FollowController [getfollowingofUser] Error", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
