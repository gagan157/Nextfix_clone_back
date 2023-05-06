const moongoose = require("mongoose");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.u452ayr.mongodb.net/`;
const databaseconnect = async () => {
  try {
    const dburl = `${uri}${process.env.DATABASE_NAME}`;
    await moongoose.connect(dburl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log("error", error);
  }
};
module.exports = databaseconnect;
