const moongoose = require('mongoose')
const uri = "mongodb://0.0.0.0:27017/";
const databaseconnect = async()=>{
    const dburl = `${uri}Netflix_db`;
    try{
        const db = await moongoose.connect(dburl)
       console.log('Database connect')
    }
    catch(error){
        console.log('error',error)
    }
}
module.exports = databaseconnect;