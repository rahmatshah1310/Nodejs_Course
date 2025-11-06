const express=require('express')
const router=express.Router()
const ProfileSettingController=require('../controllers/profile.setting.controller')
const {ensureAuthenticated}=require('../middlewares/auth.mw')
const {ProfilePicUpload}=require('../middlewares/upload.mw')


router.post("/profile-pic",ensureAuthenticated,ProfilePicUpload.single("image"),ProfileSettingController.uploadProfilePic )
router.put("/",ensureAuthenticated,ProfileSettingController.updateSettings)

module.exports=router;