const mongoose = require('mongoose')

const jwttokenSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    token_no: {
        type: String
    }
})

module.exports = mongoose.model('jwttokens', jwttokenSchema)