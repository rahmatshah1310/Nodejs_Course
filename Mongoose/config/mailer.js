const nodemailer=require('nodemailer')

const transporter=nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    }
})

module.exports=transporter;