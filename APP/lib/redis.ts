import Redis from 'ioredis';

// Connect to Redis (adjust host and port if needed)
const redis = new Redis("rediss://default:AbwVAAIjcDE2Yjg0ZThjNDk4M2Q0ZjMxODkxZjMwY2EwNjkwNmY3YXAxMA@keen-bream-48149.upstash.io:6379");

redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export { redis };
