// inspired by https://github.com/luafanti/elasticache-redis-and-lambda/blob/main/src/adapters/redis.ts
// import {Logger} from '@aws-lambda-powertools/logger'
import { RedisClientType } from "redis";

interface RedisConfig {
  //   logger: Logger
  client: RedisClientType;
}

// TODO: consider simplifying this pattern: () => () => ()
const existsInCache =
  (config: RedisConfig) =>
  async (cacheKey: string | undefined): Promise<boolean> => {
    if (!cacheKey) {
      return false;
    }
    const { client } = config;
    const result = await client.exists(cacheKey);
    return result === 1;
  };

const getFromCache =
  (config: RedisConfig) =>
  async (cacheKey: string): Promise<string | null> => {
    const { client } = config;
    return await client.get(cacheKey);
  };

const saveInCache =
  (config: RedisConfig) =>
  async (cacheKey: string, payload: string): Promise<void> => {
    const { client } = config;
    await client.set(cacheKey, payload);
  };

export const createRedisAdapter = (config: RedisConfig): RedisCache => {
  return {
    saveInCache: saveInCache(config),
    existsInCache: existsInCache(config),
    getFromCache: getFromCache(config),
  };
};

export interface RedisCache {
  getFromCache(cacheKey: string): Promise<string | null>;
  existsInCache(cacheKey: string | undefined): Promise<boolean>;
  saveInCache(cacheKey: string, apiResponse: string): Promise<void>;
}
