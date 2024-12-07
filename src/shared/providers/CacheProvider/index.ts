import { container } from 'tsyringe'

import { ICacheProviderModel } from './ICacheProviderModel'
import { RedisCacheProvider } from './implementations/redis-cache-provider'

const providers = {
  redis: RedisCacheProvider,
}

container.registerSingleton<ICacheProviderModel>(
  'CacheProvider',
  providers.redis
)
