const express = require("express");
const router = express.Router();
const StoryController = require("../controllers/story.controller");
const { ensureAuthenticated } = require("../middlewares/auth.mw");
const { storyImageUpload } = require("../middlewares/upload.mw");

router.post(
  "/",
  ensureAuthenticated,
  storyImageUpload.single("image"),
  StoryController.uploadStory
);
router.get(
  "/following",
  ensureAuthenticated,
  StoryController.getstoriesOfFollowing
);
router.get("/:id", ensureAuthenticated, StoryController.getAllStories);

router.delete("/:id", ensureAuthenticated, StoryController.deleteStory);
module.exports = router;
