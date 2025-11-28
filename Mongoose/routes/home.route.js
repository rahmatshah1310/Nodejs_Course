const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");
const { ensureAuthenticated } = require("../middlewares/auth.mw");

router.get("/", ensureAuthenticated, homeController.getHomePosts);
module.exports = router;
