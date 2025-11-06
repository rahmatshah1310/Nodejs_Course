const Follow = require("../model/follow.model");
const User = require("../model/user");

module.exports.followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }
  const follower = await User.findById(followerId);
  const following = await User.findById(followingId);

  if (!follower || !following) {
    throw new Error("Follower or following does not exist");
  }

  const isAlreadyFollowing = await Follow.findOne({
    follower: followerId,
    following: followingId,
  });

  if (isAlreadyFollowing) {
    throw new Error("You are already following this user");
  }

  const follow = new Follow({
    follower: followerId,
    following: followingId,
  });

  await follow.save();

  //you already follow this or not
  if (!following.followers?.includes(followerId)) {
    following.followers?.push(followerId);
    following.followersCount = (following.followersCount || 0) + 1;
    await following.save();
  }

  //someone follow you already or not if not then push
  if (!follower.following?.includes(followingId)) {
    follower.following.push(followerId);
    follower.followingCount = (follower.followingCount || 0) + 1;
    await follower.save();
  }
};

module.exports.unfollowUser = async (followerId, followingId) => {
  const follower = await User.findById(followerId);
  const following = await User.findById(followingId);

  if (!follower || !following) {
    throw new Error("Follower or Following does not exit");
  }

  const followRecord = await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });

  if (!followRecord) {
    throw new Error("You are not following this user");
  }

  following.follower = following.follower?.filter(
    (id) => id.toString() !== followerId.toString()
  );
  following.followersCount = Math.max(0, (following.followersCount || 0) - 1);
  await following.save();

  follower.following = follower.following?.filter(
    (id) => id.toString() !== followingId.toString()
  );
  follower.followingCount = Math.max(0, (follower.followingCount || 0) - 1);
  await follower.save();
};

module.exports.getfollowers = async (userId) => {
  try {
    const user = await User.findById(userId).populate(
      "follower",
      "userName _id profilePic fullName gender"
    );
    if (!user) {
      throw new Error("User Not Found");
    }
    return user.follower.map((follower) => ({
      id: follower._id,
      userName: follower.userName,
      profilePic: follower.profilePic,
      fullName: follower.fullName,
      gender: follower.gender,
    }));
  } catch (error) {
    console.error("FollowerService [getFollowers] Error", error);
    throw error;
  }
};

module.exports.getfollowing = async (userId) => {
  try {
    const user = await User.findById(userId).populate(
      "following",
      "userName _id profilePic fullName gender"
    );
    if (!user) {
      throw new Error("User Not Found");
    }
    return user.following.map((followedUser) => ({
      id: followedUser._id,
      userName: followedUser.userName,
      profilePic: followedUser.profilePic,
      fullName: followedUser.fullName,
      gender: followedUser.gender,
    }));
  } catch (error) {
    console.error("FollowerService [getFollowers] Error", error);
    throw error;
  }
};

module.exports.getfollowersofAnotherUser = async (userId) => {
  try {
    const user = await User.findById(userId).populate(
      "follower",
      "userName _id profilePic fullName gender"
    );
    if (!user) {
      throw new Error("User Not Found");
    }
    return user.follower.map((follower) => ({
      id: follower._id,
      userName: follower.userName,
      profilePic: follower.profilePic,
      fullName: follower.fullName,
      gender: follower.gender,
    }));
  } catch (error) {
    console.error("FollowerService [getfollowersofAnotherUser] Error", error);
    throw error;
  }
};

module.exports.getfollowingofAnotherUser = async (userId) => {
  try {
    const user = await User.findById(userId).populate(
      "following",
      "userName _id profilePic fullName gender"
    );
    if (!user) {
      throw new Error("User Not Found");
    }
    return user.following.map((followedUser) => ({
      id: followedUser._id,
      userName: followedUser.userName,
      profilePic: followedUser.profilePic,
      fullName: followedUser.fullName,
      gender: followedUser.gender,
    }));
  } catch (error) {
    console.error("FollowerService [getfollowingofAnotherUser] Error", error);
    throw error;
  }
};
