import Redis from 'ioredis';

// Connect to Redis (adjust host and port if needed)
const redis = new Redis({
  host: 'localhost', // Replace with 'host.docker.internal' if the app runs in a Docker container
  port: 6379,        // Redis default port
});

redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export { redis };
