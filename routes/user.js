const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const User = require('../models/User')
const router = require('express').Router();
const {RedisClient} = require('../helpers/redis')
const userRedisClient = new RedisClient();

//Update
router.put("/:id",verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.PASS).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new: true});
        res.status(200).json(updatedUser)
    }catch(e){
        res.status(500).json(e)
    }
})

//Delete
router.delete("/:id",verifyTokenAndAuthorization, async (req, res) => {
    try{
        await User.findOneAndDelete(req.params.id)
        res.status(200).json("User deleted")
    }catch(e){
        res.status(500).json(e)
    }
})

//Get User
router.get("/find/:id",verifyTokenAndAdmin, async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc
        res.status(200).json(others)
    }catch(e){
        res.status(500).json(e)
    }
})

//Get All User
router.get("/all",verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new
  let users = null;
    try{
      const usersCacheResult = await userRedisClient.cache_datas('users', User, {query})
      res.status(200).json(usersCacheResult)
    }catch(e){
      console.log(e);
      res.status(500).json(e)
    }
})

//Get User Stat
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;