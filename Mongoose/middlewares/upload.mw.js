const multer=require('multer')
const {CloudinaryStorage}=require('multer-storage-cloudinary')
const cloudinary=require('../config/cloudinary.config')

module.exports={
    ProfilePicUpload:multer({
       storage:new CloudinaryStorage({
        cloudinary:cloudinary,
        params:async (req,file)=>{
            userEmail=req.user.email;
            return {
                folder:`instagram-backend/${userEmail}/profile-pic`,
                allowed_formats:["jpg","jpeg","png"],
                transformation:[{width:500,height:500,crop:"fill"}]
            }
        }
       })
    }),

    postImageUpload: multer({
    storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        const userEmail = req.user.email;
        return {
          folder: `instagram-backend/${userEmail}/post-images`,
          allowed_formats: ["jpg", "jpeg", "png"],
          transformation: [{ width: 700, height: 700, crop: "fill" }],
        };
      },
    }),
  })
}

 