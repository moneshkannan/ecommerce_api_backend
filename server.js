const express = require('express');
const app = express();
// const mongoose = require('mongoose');
const {isMongoConnected} = require('./config/mongo')
const dotenv = require('dotenv');
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const speciesRoute = require('./routes/fish_api')
const {isRedisConnected} = require('./utils/redis')

dotenv.config()
isMongoConnected();
app.use(express.json());
app.use('/api/v1/user',userRoute)
app.use('/api/v1', authRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/order', orderRoute)
app.use('/api/v1/redis', speciesRoute)


app.listen(process.env.PORT || 5000,() => {
    console.log("backend server running")
})

isRedisConnected();