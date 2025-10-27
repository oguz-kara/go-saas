import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { CacheService } from '../services/cache/cache.service'

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name)
  private readonly windowMs: number
  private readonly maxRequestsPerIp: number
  private readonly maxRequestsPerKey: number

  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    // Default: 60 seconds window
    this.windowMs =
      this.configService.get<number>('RATE_LIMIT_WINDOW_MS') || 60000

    // Default: 10 requests per minute per IP
    this.maxRequestsPerIp =
      this.configService.get<number>('RATE_LIMIT_MAX_REQUESTS_PER_IP') || 10

    // Default: 100 requests per minute per API key
    this.maxRequestsPerKey =
      this.configService.get<number>('RATE_LIMIT_MAX_REQUESTS_PER_KEY') || 100
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const ipAddress = request['ipAddress'] || this.extractIpAddress(request)
    const apiKey = request['apiKey']

    // Rate limit by IP address
    const ipAllowed = await this.checkRateLimit(
      `rate_limit:ip:${ipAddress}`,
      this.maxRequestsPerIp,
    )

    if (!ipAllowed) {
      this.logger.warn(`Rate limit exceeded for IP: ${ipAddress}`)
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests from this IP. Please try again later.',
          retryAfter: Math.ceil(this.windowMs / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    // Rate limit by API key if present
    if (apiKey?.id) {
      const keyAllowed = await this.checkRateLimit(
        `rate_limit:key:${apiKey.id}`,
        this.maxRequestsPerKey,
      )

      if (!keyAllowed) {
        this.logger.warn(`Rate limit exceeded for API key: ${apiKey.id}`)
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message:
              'Too many requests with this API key. Please try again later.',
            retryAfter: Math.ceil(this.windowMs / 1000),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        )
      }
    }

    return true
  }

  private async checkRateLimit(
    key: string,
    maxRequests: number,
  ): Promise<boolean> {
    try {
      const current = await this.cacheService.get<number>(key)
      const count = current || 0

      if (count >= maxRequests) {
        return false
      }

      // Increment counter
      const ttlSeconds = Math.ceil(this.windowMs / 1000)
      await this.cacheService.set(key, count + 1, ttlSeconds)

      return true
    } catch (error) {
      this.logger.error(`Error checking rate limit for ${key}`, error)
      // On error, allow the request (fail open)
      return true
    }
  }

  private extractIpAddress(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for']
    if (forwardedFor) {
      const ips = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor.split(',')[0]
      return ips.trim()
    }

    const realIp = request.headers['x-real-ip']
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp
    }

    return request.ip || 'unknown'
  }
}
