const mongoose = require('mongoose')
const adddate = require('../logical/adddate')


const subcribtionplanSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    plantype :{
        type : String
    },
    buydate : {
        type : Date,
        default : adddate().nowDate
    },
    duration : {
        type : String
    },
    expirydate : {
        type : Date
    }
})

module.exports = mongoose.model('subsciptionplans',subcribtionplanSchema)