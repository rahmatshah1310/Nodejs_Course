const joiSchemas=require('../validation/profile.setting.schema')
const ProfileService=require('../services/profile.setting.service')

exports.uploadProfilePic=async (req,res)=>{
    try {
        const userId=req.user._id;
        const filePath=req.file.path;

        const updateUser=await ProfileService.updateProfilePic(userId,filePath);

        res.status(200).json({
            message:"Profile Picture updated succesfully",
            profilePic:updateUser.profilePic,
        })
    } catch (error) {
        console.error("ProfileController [uploadProfilePic] Error",error)

        if(error.message==="User Not Found"){
            return res.status(404).json({message:error.message})
        }
        res.status(500).json({message:"Internal Server Error"})
    }
}

exports.updateSettings=async (req,res)=>{
    try {
        const validateData=await joiSchemas.updateSettings.validateAsync(req.body)
        const userId=req.user._id;
        if(validateData.userName){
            const isAvailable=await ProfileService.checkUsernameAvailabilty(userId,validateData.userName)
            if(!isAvailable){
                return res.status(400).json({message:"Username unavailable, please select another username."});
            }
        }

        const updateUser=await ProfileService.updateSettings(userId,validateData)
        if(!updateUser){
            return res.status(404).json({message:"User Not Found"});
        }

        res.status(200).json({
            message:"Profile updated succesfully",
            data:updateUser,
        })
    } catch (error) {
        if(error.isJoi){
            return res.status(400).json({message:error.details[0].message})
        }
        console.error("ProfileController [updateSetings] Error ",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}