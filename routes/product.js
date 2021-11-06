const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const Product = require('../models/Product')
const router = require('express').Router();

// Create a Product
router.post("/",verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    }catch(err) {
        res.status(500).json(err)
    }
})

//Update
router.put("/:id",verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new: true});
        res.status(200).json(updatedProduct)
    }catch(e){
        res.status(500).json(e)
    }
})

//Delete
router.delete("/:id",verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findOneAndDelete(req.params.id)
        res.status(200).json("Product deleted")
    }catch(e){
        res.status(500).json(e)
    }
})

//Get Product
router.get("/find/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }catch(e){
        res.status(500).json(e)
    }
})

//Get All Product
router.get("/",verifyTokenAndAdmin, async (req, res) => {
    try{
        const qNew = req.query.new
        const qCategory = req.query.category
        let products
        if (qNew) {
            products = await Product.find().sort({createdAt: -1}).limit(1)
        }else if(qCategory){
            products = await Product.find({
                categories:{
                    $in: [qCategory],
                }
            })
        }else{
            products = await Product.find()
        }
        res.status(200).json(products)
    }catch(e){
        res.status(500).json(e)
    }
}) 

module.exports = router;