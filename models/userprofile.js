const mongoose = require('mongoose')

const userprofileSchemea = mongoose.Schema({
    user_id: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    first_name:{
        type : String
    },
    last_name:{
        type : String
    },
    phone:{
        type : Number,
        minlength : 10,
    },
    gender :{
        type : String
    },
    address:{
        type : String
    },
    subscription:{
        type : Boolean
    }
})

module.exports = mongoose.model('userprofiles',userprofileSchemea)