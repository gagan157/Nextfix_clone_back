const express = require('express')
const Subscibe = require('../models/subsciptionPlan')
const Users = require('../models/users')
const Userprofiles = require('../models/userprofile')
const middleware = require('../middleware/fetchuserdettails')
const adddate = require('../logical/adddate')
const bcrypt = require('bcryptjs')


const router = express.Router()



router.get('/userdetails',middleware, async(req,resp) => {
    const userid = req.user_id.id 
   
    try{
        const userdetails = await Userprofiles.findOne({user_id:userid})
     

        // if(req.params.id !== userdetails._id.toString()){
        //     return resp.send('Not Access, Somthing is wrong')
        // }
        const user = await Users.findById(userid).select('-password')
        if(!user){
            return resp.send('Not found user')
        }
        if(!userdetails){
            return resp.send('Not found user')
        }
        console.log(userdetails)
        const data = {}
        data._id = userdetails._id
        data.user_id = user._id
        data.email = user.email
        data.first_name = userdetails.first_name
        data.last_name = userdetails.last_name
        data.address = userdetails.address
        data.gender = userdetails.gender
        data.phone = userdetails.phone
        data.subscription = userdetails.subscription
        resp.send({success: true , data })
    }
    catch(error){
        resp.send({success: false,errormsg: error})
    }
    
})


//update profile
router.put('/profile_update/:id', middleware, async (req, resp) => {
    userid = req.user_id.id
    const profle = await Userprofiles.findOne({ user_id : userid })
    if (!profle) {
        return resp.send({error:'Not found'})
    } 
   
    if(profle._id.toString() !== req.params.id){
        return resp.send({error:'Not Allowed..'})
    }
    if (profle.user_id.toString() !== userid) {
        return resp.send({error:'Not Allowed'})
    }
    const { first_name, last_name, phone, gender, address } = req.body
    const newobj = {}
    if (first_name) { newobj.first_name = first_name }
    if (last_name) { newobj.last_name = last_name }
    if (phone) { newobj.phone = phone }
    if (gender) { newobj.gender = gender }
    if (address) { newobj.address = address }
    const data = await Userprofiles.findByIdAndUpdate(
        { _id: req.params.id }, { $set: newobj },{
            new: true
        }
    )
    resp.send({ success: true,data })
})

//delete user
router.delete('/delete/:id', middleware, async (req, resp) => {
    const userid = req.user_id.id

    let user = await Users.findOne({ _id: req.params.id })
    if (!user) {
        return resp.send('invalid user')
    }
    if (req.params.id.toString() !== userid) {
        return resp.send('invalid user')
    }

    user = await Users.findById({ _id: userid })
    user.remove()

    resp.send({ success: true })
})

//reset or change password
router.put('/resetpassword', middleware, async (req, resp) => {
    const userid = req.user_id.id
    const { oldpassword, newpassword } = req.body
    const user = await Users.findById({ _id: userid })
    
    if (!user) {
        return resp.send('Not found')
    }
    const verifyPass = await bcrypt.compare(oldpassword, user.password)
    if (!verifyPass) {
        return resp.send('old password not match')
    }
    const salt = await bcrypt.genSalt(10)
    const new_hashpassword = await bcrypt.hash(newpassword, salt)
    await Users.findByIdAndUpdate({ _id: userid },
        {
            $set: { password: new_hashpassword }
        })
    resp.send({ success: true })
})



router.post('/buysubcrition', middleware, async (req, resp) => {
    userid = req.user_id.id
    let submonth = req.body.planduration.month || 0
    let subyear = req.body.planduration.year || 0
    let duration = ''

    if (submonth) {
        duration = `${submonth} month`
    }
    else {
        duration = `${subyear} year`
    }

    const subdata = await Subscibe.create({
        user_id: userid,
        plantype: req.body.plantype,
        duration: duration,
        expirydate: adddate(submonth, subyear).nextDate
    })
    resp.send({ success: true })
})

module.exports = router;