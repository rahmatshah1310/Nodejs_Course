const SaveService = require("../services/save.service");

module.exports.savedPosts = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const savedPosts = await SaveService.savePost(userId, postId);
    return res.status(200).json({
      status: "success",
      message: "Post saved successfully.",
      savedPosts: savedPosts,
    });
  } catch (error) {
    console.error("SaveController [savePost] Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.unsavePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const unsavePost = await SaveService.unsavePost(userId);

    return res.status(200).json({
      status: "success",
      message: "Post UnSaved successfully.",
      savedPosts: unsavePost,
    });
  } catch (error) {
    console.error("SaveController [unSavePost] Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getSavedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await SaveService.getSavedPosts(userId);

    return res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    console.error("SaveController [getSavedPosts] Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
