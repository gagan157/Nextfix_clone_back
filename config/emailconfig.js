const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const senderemailconnect = ()=>{ 
    
        return nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.E_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.USER, // generated ethereal user
              pass: process.env.PASS, // generated ethereal password
            },
        });
    }
   
    
      


module.exports = senderemailconnect