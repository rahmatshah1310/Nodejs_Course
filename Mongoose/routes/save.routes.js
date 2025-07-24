const express = require("express");
const router = express.Router();
const saveController = require("../controllers/save.controller");
const { ensureAuthenticated } = require("../middlewares/auth.mw");

router.post("/save/:postId", ensureAuthenticated, saveController.savedPosts);
router.post("/unsave/:postId", ensureAuthenticated, saveController.unsavePost);
router.get(
  "/save/saved-posts",
  ensureAuthenticated,
  saveController.getSavedPosts
);

module.exports = router;
