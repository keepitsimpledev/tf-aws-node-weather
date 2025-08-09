import { createClient, RedisClientType } from "redis";
// import {Logger} from "@aws-lambda-powertools/logger"; // TODO: consider using this library
// import { createRedisAdapter } from "./redis-adapter";

const CACHE_HOST = process.env.cache_host;
const CACHE_PORT = process.env.cache_port;
const REDIS_URL: string = `redis://${CACHE_HOST}:${CACHE_PORT}`;
const CACHE_EXPIRATION_IN_SECONDS = 60 * 20;

// TODO: configure these:
// const REDIS_USERNAME = process.env.REDIS_USERNAME || "";
// const REDIS_AUTH_TOKEN = process.env.REDIS_AUTH_TOKEN || "";

const redisClient: RedisClientType = createClient({
  url: REDIS_URL, //,
  // password: REDIS_AUTH_TOKEN,
  // username: REDIS_USERNAME,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Function to set a key-value pair in Redis
export const setValue = async (key: string, value: string): Promise<void> => {
  await redisClient.set(key, value, { EX: CACHE_EXPIRATION_IN_SECONDS });
};

// Function to retrieve a value by key from Redis
export const getValue = async (key: string): Promise<string | null> => {
  return redisClient.get(key);
};

// TODO: pass generic function as param, rather than explicitly calling weather function
export async function getPayload(
  fn: () => Promise<unknown>,
  cacheKey: string,
): Promise<string> {
  console.log(`connecting to redis client`);
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  let response: string | null = await getValue(cacheKey);

  if (null === response) {
    console.log("fetching meteo data");
    const fetchedData = await fn();
    response = JSON.stringify(fetchedData);
    await setValue(cacheKey, response);
  } else {
    console.log("using cached data");
  }

  return response;
}
