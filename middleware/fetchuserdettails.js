const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const jwt_privateKey = process.env.jwt_privateKey

const fetchuserdetails = (req,resp,next)=>{
    let vrytokken = req.header('auth-tokken')   
    
    vrytokken ??= req.headers.authorization.split(" ")[1];         
    
    if(!vrytokken){
       return resp.status(405).send({ error: 'please authenticate using a valid tokenssss'})
    }
    try{
        const tokkn = jwt.verify(vrytokken,jwt_privateKey)        
        req.user_id = tokkn.user
        next()
    }
    catch(err){
        resp.status(405).send({ error: 'please authenticate using a valid tokens', errormsg : err })
    }
    
}

module.exports = fetchuserdetails