const express = require("express");
const router = express.Router();
const ExploreController = require("../controllers/explore.controller");
const { ensureAuthenticated } = require("../middlewares/auth.mw");


router.get("/",ensureAuthenticated,ExploreController.getExplorePosts)
module.exports=router;