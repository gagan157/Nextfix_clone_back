const databaseconnect = require('./database/monogodb')
const express = require('express')
const Users = require('./models/users')
const Subscibe = require('./models/subsciptionPlan')
var cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const allowOrigins = [
    '*',
    'http://localhost:5000',
    'http://localhost:3000',
    'https://netxflic-b-clone.onrender.com',
    'https://netxflic-clone.onrender.com',
    'https://nextfix-clone-back-pnbq28tqm-gaganrehal93-gmailcom.vercel.app/',
    'https://netfix-clone-front-dw2vhd3gi-gaganrehal93-gmailcom.vercel.app/'
]
databaseconnect()

const corsOption = {
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    origin: (origin,callback)=>{
        if(allowOrigins.indexOf(origin) !== -1 || !origin){
            callback(null,true);
        }
        else{
            callback(new Error('Not Allowed by cors'))
        }
    },
    optionsSuccessStatus: 200 
}

const app = express()
app.use(cors(corsOption))
const PORT = process.env.PORT

 
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





mongoose.connection.once('open',()=>{
    console.log('connect to DB')
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}/`)
    })
})