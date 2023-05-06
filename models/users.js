const mongoose = require('mongoose')
const jwttoken = require('./jwttoken')
const Subscibe = require('./subsciptionPlan')
const Userprofiles = require('./userprofile')

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

})

usersSchema.pre('remove', async function (next) {
    try {
        await jwttoken.deleteOne({user_id:this._id}).exec();
        await Subscibe.deleteOne({user_id:this._id}).exec();
        await Userprofiles.deleteOne({user_id:this._id}).exec();
        next();
    } catch (err) {
        next(err)
    }
})


module.exports = mongoose.model('users', usersSchema)