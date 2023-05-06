const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const jwt_privateKey = process.env.jwt_privateKey

const fetchuserdetails = (req,resp,next)=>{
    const vrytokken = req.header('auth-tokken')
    if(!vrytokken){
        resp.send({ error: 'please authenticate using a valid token'})
    }
    try{
        const tokkn = jwt.verify(vrytokken,jwt_privateKey)
        req.user_id = tokkn.user
        next()
    }
    catch(err){
        resp.send({ error: 'please authenticate using a valid tokens', errormsg : err })
    }
    
}

module.exports = fetchuserdetails