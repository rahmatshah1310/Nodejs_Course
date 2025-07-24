const User = require("../model/user");
module.exports.addUserBasic = async ({
  fullName,
  userName,
  email,
  password,
}) => {
  try {
    const newUser = new User({
      fullName: fullName.trim(),
      userName: userName.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(),
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      throw new Error("Username or email already exists");
    }
    console.error("UserService [addUserBasic] Error:", error);
    throw error;
  }
};

module.exports.readByEmail = (email) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });
      return resolve(user);
    } catch (error) {
      console.error("UserService [readByEmail] Error:", error);
      return reject(error);
    }
  });

module.exports.readById = async (id) => {
  try {
    const user = await User.findById(id).select("-password");
    return user;
  } catch (error) {
    console.error("UserService [readById] Error:", error);
    throw error;
  }
};

module.exports.readByUserName = (userName) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ userName });
      return resolve(user);
    } catch (error) {
      console.error("UserService [readByUserName] Error:", error);
      return reject(error);
    }
  });

module.exports.validatePassword = (user, password) =>
  new Promise(async (resolve, reject) => {
    try {
      const foundUser = await User.findById(user._id);
      const validation = await foundUser.isValidPassword(password);

      return resolve(validation);
    } catch (error) {
      console.error("UserService [validatePassword] error: ", error);
      return reject(error);
    }
  });

module.exports.updateForgotPasswordCode = async (user, data) => {
  try {
    const userId = user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        forgotPasswordCode: data.forgotPasswordCode,
        passwordResetCodeExpiry: data.passwordResetCodeExpiry,
      },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error("UserService [updateForgotPasswordCode] error:", error);
    throw error;
  }
};

module.exports.updatePassword = async (user, newPassword) => {
  try {
    const userId = user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        password: newPassword,
      },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error("UserService [updatePassword] error:", error);
    throw error;
  }
};

module.exports.getAllUsers = async () => {
  try {
    const getUsers = await User.find();
    return getUsers;
  } catch (error) {
    console.error("Userservice [getAllUsers Error", error);
    throw error;
  }
};

module.exports.getSingleUser = async (userId) => {
  try {
    const udpateUser = await User.findById(userId).lean();
    return udpateUser;
  } catch (error) {
    console.error("Userservice [getSingleUser] Error", error);
    throw error;
  }
};
