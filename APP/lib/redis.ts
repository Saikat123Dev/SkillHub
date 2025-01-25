import Redis from 'ioredis';

// Connect to Redis (adjust host and port if needed)
const redis = new Redis("rediss://default:AeTYAAIjcDE1NmZlNjVmOGZjOTg0MTE1ODE5MzBiYmQ1NmVlMjI2NnAxMA@living-tadpole-58584.upstash.io:6379");

redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export { redis };
