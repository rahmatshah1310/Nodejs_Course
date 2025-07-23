const StoryService = require("../services/story.service");

module.exports.uploadStory = async (req, res) => {
  try {
    const userId = req.user._id;
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    const story = await StoryService.createStory(userId, imageUrl);
    return res
      .status(201)
      .json({ message: "Story Created Succesfully", story });
  } catch (error) {
    console.error("StoryController [story] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getAllArchives = async (req, res) => {
  try {
    const userId = req.user._id;
    const archives = await StoryService.getAllArchives(userId);
    if (!archives || archives.length === 0) {
      return res.status(404).json({ message: "No Archives Found" });
    }

    return res
      .status(200)
      .json({ message: "Archives reterived succesfully", archives });
  } catch (error) {
    console.error("StoryController [getAllArchives] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getAllStories = async (req, res) => {
  try {
    const userId = req.user._id;
    const allStories = await StoryService.getUserStories(userId);

    return res
      .status(200)
      .json({ message: "AllStories Get succesfully", stories: allStories });
  } catch (error) {
    console.error("StoryController [getAllArchives] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await StoryService.deleteStory(id, req.user._id);
    if (!deleted) {
      return res.status(404).json({ message: "Story not found." });
    }

    return res.status(200).json({ message: "Story Deleted Succesfully" });
  } catch (error) {
    console.error("StoryController [deleteStory] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getstoriesOfFollowing = async (req, res) => {
  try {
    const userId = req.user._id;
    const stories = await StoryService.getstoriesOfFollowing(userId);
    if (!stories || stories.length === 0) {
      return res.status(404).json({ message: "Story not found." });
    }

    return res
      .status(200)
      .json({ message: "Story reterived Succesfully", stories });
  } catch (error) {
    console.error("StoryController [getstoriesOfFollowing] Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
