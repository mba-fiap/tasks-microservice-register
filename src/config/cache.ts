import { RedisOptions } from 'ioredis'

interface ICacheConfig {
  driver: 'redis'
  config: {
    redis: RedisOptions
  }
}

export const CacheConfig = {
  driver: process.env.CACHE_DRIVER || 'redis',
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASS || undefined,
    },
  },
} as ICacheConfig
