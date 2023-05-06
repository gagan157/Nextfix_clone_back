const express = require('express')
const Users = require('../models/users')
const Userprofile = require('../models/userprofile')
const jwt = require('jsonwebtoken')
const Jwttokken = require('../models/jwttoken')
const router = express.Router()
const bcrypt = require('bcryptjs');
const senderemailconnect = require('../config/emailconfig')
const dotenv = require('dotenv')
dotenv.config()


const jwt_privateKey = process.env.jwt_privateKey

router.post('/createusers', async (req, resp) => {
    let useremail = req.body.email
    let user = await Users.findOne({ email: useremail })
    if (user) {
        resp.send('Your email is already exsits')
    }
    else {
        const {email,password} = req.body
        let salt = await bcrypt.genSalt(10)
        let pass = await bcrypt.hash(password,salt)
        const users = await Users.create({
            email:email,
            password:pass
        })
        const userid = users._id
        const data = {
            user: {
                id: userid
            }
        }
        const token = jwt.sign(data, jwt_privateKey)
        await Jwttokken.create({
            user_id: userid,
            token_no: token
        })
        await Userprofile.create({
            user_id : userid
        })

        resp.status(201).send({ success: true ,msg:'Account Created sucessfully'})
    }
})




router.post('/login', async (req, resp) => {
    const email = req.body.email
    const password = req.body.password
    let user = await Users.findOne({ email: email })
    if (!user) {
        return resp.status(401).send('your email or password not correct')
    }
    const userid = user._id
    try {
        const jwtverify = await Jwttokken.findOne({ user_id: userid })
        if (!jwtverify) {
            return resp.send('auth token not valid')
        }
        const vrytokken = jwtverify.token_no
        const vry = jwt.verify(vrytokken, jwt_privateKey)
        if (!vry) {
            return resp.status(401).send('auth token not valid')
        }
        let pass = await bcrypt.compare(password,user.password)
        if (!pass) {
            return resp.status(401).send('your email or password not correct')
        }
        const data = {
            user: {
                id: user._id
            }
        }
        const tokken = jwt.sign(data, jwt_privateKey, { expiresIn: '1h' })
        resp.send({ success: true, token: tokken })
    }
    catch (err) {
        resp.status(400).send({success:false,err})
    }

})

//forgot password send email
router.post('/sendresetpasswordemail',async(req,resp)=>{
    const {email} = req.body
    if(!email){
        return resp.send('All field are required')
    }
    const user = await Users.findOne({email:email})
    if(!user){
        return resp.send('your email not exists')
    }
    const secretkey = user._id+jwt_privateKey
    const token = jwt.sign({userid:user._id},secretkey,{expiresIn : '15m'})
    console.log(email) 
      
      const link = `http://localhost:3000/api/user/resetpassword/${user._id}/${token}`
      var mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Reset password request',
        html: `<a href='${link}'>Click here</a> This link will be valid only 15min`
      };
    
    const transporter = senderemailconnect()      
    const info = await transporter.sendMail(mailOptions);
    resp.send({ success: true, msg: 'Send successfully please check your Email' })
})

//forgot password reset password
router.put('/resetpassword/:id/:token',async(req,resp)=>{
    const {newpassword} = req.body
    const {id,token} = req.params
    try{
        if(!newpassword){
            return resp.send('All field required')
        }
        const user = await Users.findById(id)
        if(!user){
            return resp.send('Token Not Valid')
        }
        const secretkey = user._id+jwt_privateKey
        const verytoken = jwt.verify(token,secretkey)
        if(!verytoken){
            return resp.send('token not valid')
        }
        if(id!==verytoken.userid){
            return resp.send('Token no valid')
        }
        const salt = await bcrypt.genSalt(10)
        const newhashpassword = await bcrypt.hash(newpassword,salt)
        const updateuser = await Users.findByIdAndUpdate(id,{$set:{password:newhashpassword}}) 
        resp.send({success:true,msg:'Password change sucessfully'})
    }
    catch(err){
        resp.status(408).send({success:false,msg:'something wrong',err})
    }
   
})


module.exports = router;