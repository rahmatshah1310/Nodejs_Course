const User = require("../model/user");
const cloudinary = require("../config/cloudinary.config");
const Archive = require("../model/archive.model");
const Story = require("../model/story.model");

module.exports.createStory = async (userId, imageUrl) => {
  const story = new Story({
    user: userId,
    imageUrl,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  await story.save();
  await User.findByIdAndUpdate(
    userId,
    { $push: { stories: story._id } },
    { new: true }
  );

  const archive = new Archive({
    user: userId,
    imageUrl,
  });

  await archive.save();
  return story;
};

module.exports.getUserStories = async (userId) => {
  const stories = await Story.find({ user: userId });
  return stories;
};

exports.deleteStory = async (storyId, userId) => {
  try {
    const story = await Story.findOne({ _id: storyId, user: userId }).populate(
      "user",
      "email"
    );
    if (!story) return null;
    const userEmail = story.user.email;

    await User.findByIdAndUpdate(
      userId,
      { $pull: { stories: storyId } },
      { new: true }
    );
    const fullUrl = story.imageUrl;
    const publicId = fullUrl.split("/").pop().split(".")[0];

    const cloudinaryPath = `instagram-backend/${userEmail}/stories/${publicId}`;

    const result = await cloudinary.uploader.destroy(cloudinaryPath);
    console.log("Cloudinary Deletion Result", result);

    const deleteStory = await Story.findByIdAndDelete(storyId);
    return deleteStory;
  } catch (error) {
    console.error("StoryService [deleteStory] Error", error);
    throw error;
  }
};

module.exports.getAllArchives = async (userId) => {
  try {
    const archives = await Archive.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    return archives;
  } catch (error) {
    console.error("StoryService {getAllArchives] Error", error);
    throw error;
  }
};

module.exports.getstoriesOfFollowing = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select("following")
      .populate("following", "fullName userName profilePic")
      .lean();
    if (!user || !user.following || user.following.length === 0) {
      return [];
    }

    const followingUserIds = user.following.map(
      (followedUser) => followedUser._id
    );
    const stories = await Story.find({ user: { $in: followingUserIds } })
      .sort({ createdAt: -1 })
      .populate("user", "fullName userName profilePic")
      .lean();

    const groupStories = user.following.map((followedUser) => {
      const userStories = stories
        .filter(
          (story) => story.user._id.toString() === followedUser._id.toString()
        )
        .map((story) => {
          const { user, ...storyData } = story;
          return storyData;
        });

      return {
        user: {
          _id: followedUser._id,
          fullName: followedUser.fullName,
          userName: followedUser.userName,
          profilePic: followedUser.profilePic,
          stories: userStories,
        },
      };
    });
    return groupStories;
  } catch (error) {
    console.error("StoryService [geatstoriesOfFollowing] Error", error);
    throw error;
  }
};
