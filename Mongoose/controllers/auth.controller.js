const joiSchemas = require("../validation/user.schema");
const UserService = require("../services/user.service");
const { generateToken } = require("../helpers/jwt");
const crypto=require('crypto')
const mailer=require('../config/mailer')

module.exports.local_signup_post = async (req, res) => {
  try {
    const results = await joiSchemas.local_signup_post.validateAsync(req.body);

    const newUser = await UserService.addUserBasic({
      fullName: results.fullName,
      userName: results.userName,
      email: results.email,
      password: results.password,
    });

     return res.success(generateToken(newUser));
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports.local_login_post = async (req, res) => {
  try {
    const { identifier, password } = await joiSchemas.local_login_post.validateAsync(req.body);
    const isEmail = identifier.includes("@");

    const user = isEmail
      ? await UserService.readByEmail(identifier)
      : await UserService.readByUserName(identifier);

    if (!user) return res.status(401).json({ error: "Invalid Email or Username" });

    const isMatch = await UserService.validatePassword(user, password);
    if (!isMatch) return res.status(401).json({ error: "Invalid Password" });

    const token = generateToken(user);
    return res.success(token);
  } catch (error) {
    console.error("Login Error", error);
    return res.status(500).json({ error: error.message });
  }
};


module.exports.get_me= async (req,res)=>{
  try {
  res.success(req.user)
  
  } catch (error) {
    return res.status(500).json({error:error.message})
  }
}



module.exports.change_password_post= async (req,res)=>{
  try {
    const results=await joiSchemas.change_password_post.validateAsync(req.body)
    isPasswordValid=await UserService.validatePassword(req.user._id,results.currentPassword);
    if(!isPasswordValid) return res.fail("Incorrect Current Password")
      await UserService.validatePassword(req.user._id,results.newPassword);
    return res.success("Password Changed Successfully")
  } catch (error) {
     return res.status(500).json({error:error.message})
  }
}

module.exports.forgot_password_post=async (req,res)=>{
  try {
    const results= await joiSchemas.forgot_password_post.validateAsync(req.body)
    let user= await UserService.readByEmail(results.email);
    if(!user) return res.fail("User with this email is not Signup yet");
     const forgotPasswordCode=crypto.randomInt(100000, 999999);
    const passwordResetCodeExpiry=Date.now() + 3600000;

    await UserService.updateForgotPasswordCode(user._id,{passwordResetCodeExpiry,forgotPasswordCode});
    await mailer.sendMail({
      to:results.email,
      subject:"Instagram Password Reset Code",
      text:`Your password reset code is: ${forgotPasswordCode} `
    })
    console.log("Reset code for", results.email, "is:", forgotPasswordCode);
  
    return res.success("Reset Code sent to your email")
  } catch (error) {
    return res.status(500).json({error:error.message})
  }
}

module.exports.reset_password_post=async (req,res)=>{
  try {
    const results= await joiSchemas.reset_password_post.validateAsync(req.body)
      let user= await UserService.readByEmail(results.email);
    if(!user) return res.fail("User with this email is not Signup yet");
    if(user.forgotPasswordCode !== Number(results.forgotPasswordCode) || Date.now() > user.passwordResetCodeExpiry){
      return res.fail("Invalid or expire reset code.")
    }
    await UserService.updatePassword(user._id,results.newPassword);
    return res.success("Password has been updated")
  } catch (error) {
     return res.status(500).json({error:error.message})
  }
}