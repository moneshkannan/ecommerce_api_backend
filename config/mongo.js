const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const url = process.env.MONGO_URL
const isMongoConnected = async() => {
    try{
        await mongoose.connect(url)
        console.log("DB connected successfully")
    }catch(err){
        console.log(err)
    }
}

module.exports = {isMongoConnected}