const {createRedisClient} = require('../utils/redis')

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
        const result = await this.client.get(key);
        console.log(result);
        this.cache_obj.fromCache = true;
        this.cache_obj.data = JSON.parse(result);
        return this.cache_obj;
    }
    async set(key, value){
        await this.client.set(key, value);
    }
    async quit(){
        await this.client.quit();
    }
}

module.exports = {RedisClient}