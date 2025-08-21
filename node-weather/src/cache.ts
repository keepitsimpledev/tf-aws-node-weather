import { createClient, RedisClientType } from "redis";
// import {Logger} from "@aws-lambda-powertools/logger"; // TODO: consider using this library

const CACHE_HOST = process.env.cache_host;
const CACHE_PORT = process.env.cache_port;
const REDIS_URL: string = `redis://${CACHE_HOST}:${CACHE_PORT}`;
const CACHE_EXPIRATION_IN_SECONDS = 60 * 20;

const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Function to set a key-value pair in Redis
export const put = async (key: string, value: string): Promise<void> => {
  await redisClient.set(key, value, { EX: CACHE_EXPIRATION_IN_SECONDS });
};

// Function to retrieve a value by key from Redis
export const get = async (key: string): Promise<string | null> => {
  return redisClient.get(key);
};

export async function getPayload(
  fn: () => Promise<unknown>,
  cacheKey: string,
): Promise<string> {
  if (!redisClient.isOpen) {
    console.log(`connecting to redis client`);
    await redisClient.connect();
  }

  let response: string | null = await get(cacheKey);

  if (null === response) {
    console.log("fetching meteo data");
    const fetchedData = await fn();
    response = JSON.stringify(fetchedData);
    await put(cacheKey, response);
  } else {
    console.log("using cached data");
  }

  return response;
}
