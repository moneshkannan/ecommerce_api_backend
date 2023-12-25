const Product = require('../models/Product')
const Chance = require('chance')
const chance = new Chance()
const {isMongoConnected} = require('../config/mongo')

const generateDummyData = async (count) => {
    const dummyData = [];

    const productPromises = Array.from({length: count},async() => {
        const product = {
            title: chance.word(),
            description: chance.sentence(),
            image: chance.avatar(),
            categories: chance.unique(chance.word, 3),
            size: chance.pickone(['Small', 'Medium', 'Large']),
            color: chance.color(),
            price: chance.floating({ min: 0, max: 100, fixed: 2 }),
        };

        dummyData.push(product);
        return addProduct(product);
    })

    await Promise.all(productPromises)

    return dummyData;
};

const addProduct = async (product) => {
    console.log(product);
    try{
        let conn = await isMongoConnected()
        console.log(conn);
        const newProduct = new Product(product)
        return await newProduct.save()
    }catch(err){
        console.error('Error adding product:', err.message);
        throw err
    }
}

const executeScript = () => {
    const count = process.argv[2] || 50;

    const dummyData = generateDummyData(count);

    console.log(dummyData);
};

// Check if the script is being executed directly
if (require.main === module) {
    executeScript();
}
