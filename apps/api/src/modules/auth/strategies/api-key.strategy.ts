import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { ApiKeyService } from 'src/modules/api-key/application/services/api-key.service'

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private readonly apiKeyService: ApiKeyService) {
    super()
  }

  async validate(req: any): Promise<any> {
    const apiKey = this.extractApiKey(req)

    if (!apiKey) {
      throw new UnauthorizedException('API key not provided')
    }

    const validatedKey = await this.apiKeyService.validateApiKey(apiKey)

    if (!validatedKey) {
      throw new UnauthorizedException('Invalid or expired API key')
    }

    // Update usage stats with IP (fire and forget)
    const ipAddress = this.extractIpAddress(req)
    this.apiKeyService
      .updateUsageStatsWithIp(validatedKey.id, ipAddress)
      .catch(() => {
        // Silently fail - don't block the request
      })

    // Return user-like object that matches JWT strategy return
    return {
      id: validatedKey.createdById,
      channelToken: validatedKey.channelToken,
      apiKeyId: validatedKey.id,
      apiKeyName: validatedKey.name,
    }
  }

  private extractApiKey(request: any): string | undefined {
    // Check for API key in X-API-Key header
    const headerKey = request.headers?.['x-api-key'] as string | undefined

    // Also check for Authorization header with Bearer token format
    const authHeader = request.headers?.authorization
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    return headerKey
  }

  private extractIpAddress(request: any): string {
    // Try to get real IP from proxy headers first
    const forwardedFor = request.headers?.['x-forwarded-for']
    if (forwardedFor) {
      const ips = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor.split(',')[0]
      return ips.trim()
    }

    const realIp = request.headers?.['x-real-ip']
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp
    }

    return request.ip || 'unknown'
  }
}
