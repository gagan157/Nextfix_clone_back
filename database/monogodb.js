const moongoose = require('mongoose')

const databaseconnect = async()=>{
    const dburl = 'mongodb://localhost:27017/Netflix_db';
    try{
        const db = await moongoose.connect(dburl)
       console.log('Database connect')
    }
    catch(error){
        console.log('error',error)
    }
}
module.exports = databaseconnect;