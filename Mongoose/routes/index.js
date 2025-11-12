const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/profile-settings", require("./profile.setting.routes"));
router.use("/post", require("./post.routes"));
router.use("/", require("./follow.routes"));
router.use("/story", require("./story.routes"));
router.use("/archives", require("./archive.routes"));

// ✅ move /home before /
router.use("/home", require("./home.route"));
router.use("/explore",require("./explore.route"))
router.use("/", require("./save.routes"));

module.exports = router;
