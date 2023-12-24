const Ioredis = require('ioredis');

const createRedisClient = () => {
    return new Ioredis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    })
}

const isRedisConnected = async () => {
    const client = createRedisClient();
    try {
        if (client.status === 'connecting' || client.status === 'connected') {
            console.log('Redis is already connecting/connected');
        } else {
            await client.connect();
            console.log('Redis connection status:', client.status);
        }
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }finally{
        await client.quit();
    }
}


const redis_client = () => redis.createClient();

module.exports = {createRedisClient, isRedisConnected}