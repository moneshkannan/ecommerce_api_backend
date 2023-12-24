const axios = require('axios')
const router = require('express').Router();
const {RedisClient} = require('../helpers/redis')
const redisClient = new RedisClient();

const fetchApiData = async(species) => {
    const response = await axios.get(
        `https://www.fishwatch.gov/api/species/${species}`
    )
    console.log("api sent");
    return response.data;
    
}

const getSpeciesData = async (req, res) =>{
    const species = req.params.species
    let results;
    try{
        // const client = createRedisClient(); 
        const cacheResult = await redisClient.get(species);
        if(cacheResult){
            results = cacheResult;
        }else{
            results = {
                fromCache:false,
                data:null
            };
            results.data = await fetchApiData(species)
            if (results?.data?.length === 0) {
                throw "API returned an empty array";
            }
            await redisClient.set(species, JSON.stringify(results))
        }
        // await redisClient.quit();
          res.send(results);
        // res.status(200).json(data)
    }catch(e){
        console.log(e);
        res.status(500).json(e)
    }
}

router.get("/:species", getSpeciesData)

module.exports = router;