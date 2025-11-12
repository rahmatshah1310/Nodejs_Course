const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middlewares/auth.mw");
const followController = require("../controllers/follow.controller");

router.get("/followers", ensureAuthenticated, followController.getfollower);
router.get("/following", ensureAuthenticated, followController.getfollowing);
router.post(
  "/follow/:targetUserId",
  ensureAuthenticated,
  followController.followUser
);
router.post(
  "/unfollow/:targetUserId",
  ensureAuthenticated,
  followController.unfollowUser
);

router.get(
  "/followers/:id",
  ensureAuthenticated,
  followController.getfollowerofUser
);

router.get(
  "/following/:id",
  ensureAuthenticated,
  followController.getfollowingofUser
);

module.exports = router;
