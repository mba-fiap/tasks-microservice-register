import { CacheConfig } from '@/config/cache'
import Redis, { Redis as RedisClient } from 'ioredis'

import {
  ISaveDTO,
  IRecoverDTO,
  IInvalidateDTO,
  IInvalidatePrefixDTO,
} from '@/shared/providers/CacheProvider/dtos'
import { ICacheProviderModel } from '@/shared/providers/CacheProvider/ICacheProviderModel'

export class RedisCacheProvider implements ICacheProviderModel {
  private client: RedisClient

  constructor() {
    this.client = new Redis(CacheConfig.config.redis)
  }

  public async save({ key, value, expirationTime }: ISaveDTO): Promise<void> {
    if (expirationTime) {
      await this.client.setex(key, expirationTime, JSON.stringify(value))
    } else {
      await this.client.set(key, JSON.stringify(value))
    }
  }

  public async recover<T>({ key }: IRecoverDTO): Promise<T | null> {
    const data = await this.client.get(key)

    if (!data) {
      return null
    }

    const parsedData: T = JSON.parse(data)

    return parsedData
  }

  public async invalidate({ key }: IInvalidateDTO): Promise<void> {
    await this.client.del(key)
  }

  public async invalidatePrefix({
    prefix,
  }: IInvalidatePrefixDTO): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`)

    const pipeline = this.client.pipeline()

    keys.forEach((key) => {
      pipeline.del(key)
    })

    await pipeline.exec()
  }
}
