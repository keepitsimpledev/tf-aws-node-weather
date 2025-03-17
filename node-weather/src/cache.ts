import { createClient, RedisClientType } from "redis";
// import {Logger} from "@aws-lambda-powertools/logger"; // TODO: consider using this library
import { createRedisAdapter } from "./redis-adapter";
import { fetchWeather } from "./meteo";

// TODO: configure these:
const REDIS_URL = process.env.REDIS_URL || ""; // use tf variables.cache_host
const REDIS_USERNAME = process.env.REDIS_USERNAME || "";
const REDIS_AUTH_TOKEN = process.env.REDIS_AUTH_TOKEN || "";
const KEY_CACHED_WEATHER = "WEATHER_CACHE"; // TODO: move weather-related behavior out of this class

const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
  password: REDIS_AUTH_TOKEN,
  username: REDIS_USERNAME,
});

// TODO: pass generic function as param, rather than explicitly calling weather function
export async function getPayload(): Promise<string> {
  // export async function getPayload(cacheKey: string): Promise<string> { // TODO: return this signature
  const cacheKey = KEY_CACHED_WEATHER;
  const redisAdapter = createRedisAdapter({ client: redisClient });
  await redisClient.connect();

  let response: string;
  if (await redisAdapter.existsInCache(cacheKey)) {
    response = (await redisAdapter.getFromCache(cacheKey)) || "";
  } else {
    const weatherData = fetchWeather();
    response = JSON.stringify(weatherData);
    redisAdapter.saveInCache(cacheKey, response);
  }
  return response;
}
