const router = require('express').Router();
const Cryptojs = require('crypto-js')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
// Register
router.post('/register',async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: Cryptojs.AES.encrypt(req.body.password, process.env.PASS).toString(),
    })
    try{
        const saved_user = await newUser.save()
        res.status(201).json(saved_user)
        console.log(newUser)
    }catch(err){
        res.status(500).json(err)
        console.log(err)
    }
})

//Login
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        if(!user){
            res.status(401).json("wrong credentials")
        }
        const hashed_password = Cryptojs.AES.decrypt(user.password, process.env.PASS)
        const original_password = hashed_password.toString(Cryptojs.enc.Utf8)
        if(original_password !== req.body.password){
            res.status(401).json("wrong password")
        }
        const accesstoken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        {expiresIn:"3d"})
        const {password, ...others} = user._doc;
        res.status(200).json({...others, accesstoken})
    }catch(err){
        res.status(500).json(err)
    }
})
module.exports = router;