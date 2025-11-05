const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { ensureAuthenticated } = require("../middlewares/auth.mw");

router.post("/signup", authController.local_signup_post);
router.post("/login", authController.local_login_post);
router.get("/me", ensureAuthenticated, authController.get_me);
router.post(
  "/change-password",
  ensureAuthenticated,
  authController.change_password_post
);
router.post("/forgot-password", authController.forgot_password_post);
router.post("/reset-password", authController.reset_password_post);

router.get("/all", authController.getAllUsers);
router.get("/user/:id", authController.getSingleUser);
module.exports = router;
