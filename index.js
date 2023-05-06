const databaseconnect = require('./database/monogodb')
const express = require('express')
const Users = require('./models/users')
const Subscibe = require('./models/subsciptionPlan')
var cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()


const app = express()
app.use(cors())
let port = process.env.PORT
databaseconnect()
 
app.use(express.json())
app.use('/api/user', require('./routes/users_router'))
app.use('/api/auth', require('./routes/auth_router'))


app.get('/', async (req, resp) => {
    Users.aggregate([
        {
            $lookup: {
                from: 'userprofiles',
                localField: '_id',
                foreignField: 'user_id',
                as: 'profile'
            }
        },
        {
            $lookup: {
                from: 'subsciptionplans',
                localField: '_id',
                foreignField: 'user_id',
                as: 'subs_plan'
            }
        },
        { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$subs_plan",preserveNullAndEmptyArrays: true } },
        {
            "$project": {
                "password": 0,
                
                "profile.user_id":0,
                
                "subs_plan.user_id":0

            }
        }


    ], (error, data) => {
        return resp.send(data)
    })
})






app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
})