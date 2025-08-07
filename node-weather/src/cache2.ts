// https://medium.com/@alessandro.traversi/integrating-redis-with-typescript-using-the-official-redis-library-9cf121da3fb9
import { createClient } from "redis";

const CACHE_HOST = process.env.cache_host;
const CACHE_PORT = process.env.cache_port;

// Create and configure Redis client
const cacheHost: string = `redis://${CACHE_HOST}:${CACHE_PORT}`;
const redisClient = createClient({
  url: cacheHost
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Function to set a key-value pair in Redis
export const setValue = async (key: string, value: string): Promise<void> => {
  await redisClient.set(key, value, {EX: 60});
};

// Function to retrieve a value by key from Redis
export const getValue = async (key: string): Promise<string | null> => {
  return redisClient.get(key);
};

export async function doCache(): Promise<string> {
  console.log(`CACHE_HOST: ${CACHE_HOST}`);
  console.log(`CACHE_PORT: ${CACHE_PORT}`);
  console.log(`cacheHost: ${cacheHost}`);

  // Connect to Redis
  console.log(`connecting to redis client`);
  await redisClient.connect();

  console.log(`getKenny: ${await getValue("kennay")}`);
  await setValue("kennay", "Cat");
  console.log(`getKenny: ${await getValue("kennay")}`);

  return "done";
}
