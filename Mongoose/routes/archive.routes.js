const express = require("express");
const router = express.Router();
const StoryController = require("../controllers/story.controller");
const { ensureAuthenticated } = require("../middlewares/auth.mw");

router.get("/:id", ensureAuthenticated, StoryController.getAllArchives);

module.exports = router;
