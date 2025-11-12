const User=require("../model/user")
const cloudinary=require("../config/cloudinary.config")


exports.updateProfilePic= async (userId,filePath)=>{
    try {

        const user=await User.findById(userId);
        if(!user) throw new Error("User Not Found");

        if(user.profilePic){
            const fullUrl = user.profilePic;
      const publicId = fullUrl.split("/").pop().split(".")[0];

             const userEmail=user.email;
        const cloudinaryPath=`instagram-backend/${userEmail}/profile-pic/${publicId}`

        const result=await cloudinary.uploader.destroy(cloudinaryPath);
        console.log("Cloudinary Deletion Result",result);
        }

        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:filePath},{new:true})
        return updatedUser;
       
    } catch (error) {
        console.error("ProfileService [updateProfilePic] Error",error)
        throw error;
    }
}

exports.checkUsernameAvailabilty=async (userId,userName)=>{
    try {
        const existingUser=await User.findOne({
            userName:userName,
            _id:{$ne:userId}
        })
        return !existingUser
    } catch (error) {
        console.error("ProfileService [checkUserAvailability] Error",error)
        throw error
    }
}

exports.updateSettings=async (userId,updateData)=>{
    try {
        const udpateUser=await User.findOneAndUpdate(userId,updateData,{new:true})
        if(!udpateUser) throw new Error("User Not Found")

        return udpateUser;
    } catch (error) {
     console.error("ProfileService [updateSetting] error",error)
     throw error;   
    }
}