const {createRedisClient} = require('../utils/redis')
const {getModelName} = require('./helpers')
class RedisClient{
    constructor(){
        this.client = createRedisClient();
        this.client.on('error', (err) => {
            console.log(err);
        });
        this.cache_obj = {
            fromCache: false,
            data: null
        }
    }
    async get(key){
        let result = await this.client.get(key);
        result = JSON.parse(result)
        if(result){
            result['fromCache'] = true
            result['data'] = result.data ? result.data : null
        }
        return result;
    }
    async set(key, value){
        await this.client.set(key, value);
    }
    async quit(){
        await this.client.quit();
    }
    async updateCacheOnDataChange(key, value){
        await this.client.set(key, value);
    };

    async cache_datas(key, db_model, {query, listProducts, qNew, qCategory}){
        let results;
        const client = await this.get(key);
        const model_name = getModelName(db_model)
        if(client){
            results = client
        }else{
            results ={
            fromCache:false,
            data:null
            }
            if(model_name == 'User'){
                results['data'] = query? await db_model.find().sort({_id: -1}).limit(5) : await db_model.find()
            }else if(model_name == 'Product'){
                results['data'] = await listProducts(qNew, qCategory)
            }
            if (results['data'] && results['data'].length === 0) {
            throw "API returned an empty array";
            }
            await this.set(key, JSON.stringify(results))
        }
        return results
    }
}

module.exports = {RedisClient}