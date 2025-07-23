const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  isPulic: {
    type: Boolean,
    default: true,
  },
  profilePic: {
    type: String,
    default: process.env.DEFAULT_PROFILE_PICTURE || null,
  },
  bio: {
    type: String,
    default: "",
  },
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  follower: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  forgotPasswordCode: { type: Number, default: null },
  passwordResetCodeExpiry: { type: Date, default: null },
  stories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//hash password before update
userSchema.pre("findOneAndUpdate", async function (next) {
  const updateInfo = this.getUpdate();
  if (updateInfo.password) {
    updateInfo.password = await bcrypt.hash(updateInfo.password, 10);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

module.exports = mongoose.model("User", userSchema);
