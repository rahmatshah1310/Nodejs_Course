const HomeService = require("../services/home.service");

module.exports.getHomePosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;
    const posts = await HomeService.getPostsFromFollowing(userId, limit);
    return res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    console.error("PostController [getHomePosts] Error:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching posts.",
    });
  }
};
