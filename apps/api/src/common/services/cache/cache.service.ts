import { Injectable, Inject, Logger } from '@nestjs/common'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name)

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return (await this.cacheManager.get<T>(key)) ?? undefined
    } catch (error) {
      this.logger.error(
        `Error getting key ${key} from cache: ${error.message}`,
        error.stack,
      )
      return undefined
    }
  }

  async set<T>(key: string, value: T, ttlInSeconds?: number): Promise<void> {
    try {
      if (ttlInSeconds !== undefined) {
        await this.cacheManager.set(key, value, ttlInSeconds)
      } else {
        await this.cacheManager.set(key, value)
      }
    } catch (error) {
      this.logger.error(
        `Error setting key ${key} in cache: ${error.message}`,
        error.stack,
      )
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key)
    } catch (error) {
      this.logger.error(
        `Error deleting key ${key} from cache: ${error.message}`,
        error.stack,
      )
    }
  }

  async reset(): Promise<void> {
    try {
      if (typeof (this.cacheManager as any).reset === 'function') {
        await (this.cacheManager as any).reset()
        this.logger.log('Cache has been reset.')
      } else {
        this.logger.warn(
          'Cache reset is not supported by the current cache store.',
        )
      }
    } catch (error) {
      this.logger.error(`Error resetting cache: ${error.message}`, error.stack)
    }
  }
}
