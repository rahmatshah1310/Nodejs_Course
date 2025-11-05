const express = require("express");
const router = express.Router();
const { postImageUpload } = require("../middlewares/upload.mw");
const { ensureAuthenticated } = require("../middlewares/auth.mw");
const postController = require("../controllers/post.controller");

// Place all /comment and /comments routes BEFORE any /:id route!
router.post(
  "/",
  ensureAuthenticated,
  postImageUpload.array("images", 10),
  postController.createPost
);
router.put("/caption/:id", ensureAuthenticated, postController.updateCaption);
router.put("/:id", ensureAuthenticated, postController.updatePost);
router.delete("/:id", ensureAuthenticated, postController.deletePost);
router.post("/like/:id", ensureAuthenticated, postController.likePost);
router.post("/dislike/:id", ensureAuthenticated, postController.dislikePost);
router.delete(
  "/comment/:postId/:commentId",
  ensureAuthenticated,
  postController.deleteComment
);
router.post("/comment/:id", ensureAuthenticated, postController.addComment);

router.get("/my-posts", ensureAuthenticated, postController.getPostByUser);
router.get(
  "/comments/:id",
  ensureAuthenticated,
  postController.getPostComments
);

router.get("/:id", ensureAuthenticated, postController.getPostById);

module.exports = router;
