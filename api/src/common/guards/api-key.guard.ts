import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { Request } from 'express'
import { ApiKeyService } from 'src/modules/api-key/application/services/api-key.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name)

  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const apiKey = this.extractApiKey(request)

    if (!apiKey) {
      this.logger.warn('API key not provided in request')
      throw new UnauthorizedException('API key is required')
    }

    const validatedKey = await this.apiKeyService.validateApiKey(apiKey)

    if (!validatedKey) {
      this.logger.warn('Invalid or expired API key')
      throw new UnauthorizedException('Invalid or expired API key')
    }

    // Attach validated key info to request for use in controllers
    request['apiKey'] = validatedKey

    // Extract IP address for rate limiting and tracking
    const ipAddress = this.extractIpAddress(request)
    request['ipAddress'] = ipAddress

    // Update usage stats with IP (fire and forget)
    this.apiKeyService
      .updateUsageStatsWithIp(validatedKey.id, ipAddress)
      .catch((err) => {
        this.logger.error('Failed to update usage stats', err)
      })

    this.logger.log(
      `API key validated: ${validatedKey.id} from IP: ${ipAddress}`,
    )

    return true
  }

  private extractApiKey(request: Request): string | undefined {
    // Check for API key in X-API-Key header
    const headerKey = request.headers['x-api-key'] as string | undefined

    // Also check for Authorization header with Bearer token format
    const authHeader = request.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    return headerKey
  }

  private extractIpAddress(request: Request): string {
    // Try to get real IP from proxy headers first
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
