import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/common'
import { RequestContext } from 'src/common/request-context/request-context'
import {
  ApiKeyEntity,
  GeneratedApiKeyEntity,
} from '../../domain/api-key.entity'
import { ValidatedApiKey } from '../../domain/api-key.interface'
import * as crypto from 'crypto'

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name)

  constructor(private readonly prisma: PrismaService) {}

  async generateApiKey(
    ctx: RequestContext,
    name: string,
  ): Promise<GeneratedApiKeyEntity> {
    const { user, channel } = ctx

    if (!user) {
      throw new UnauthorizedException('User not authenticated')
    }

    if (!channel.token) {
      throw new UnauthorizedException('Channel token is required')
    }

    // Generate a random API key
    const plainKey = this.generateRandomKey()
    const keyHash = this.hashKey(plainKey)
    const prefix = plainKey.substring(0, 12) // Show first 12 chars for identification

    try {
      const apiKey = await this.prisma.apiKey.create({
        data: {
          name,
          keyHash,
          prefix,
          channelToken: channel.token,
          createdById: user.id,
        },
        include: {
          createdBy: true,
        },
      })

      this.logger.log(
        `API Key generated: ${apiKey.id} by user ${user.id} for channel ${channel.token}`,
      )

      return {
        ...(apiKey as unknown as ApiKeyEntity),
        plainKey, // Only returned once
      }
    } catch (error) {
      this.logger.error('Failed to generate API key', error?.stack)
      throw new Error('Could not generate API key')
    }
  }

  async validateApiKey(plainKey: string): Promise<ValidatedApiKey | null> {
    const keyHash = this.hashKey(plainKey)

    try {
      const apiKey = await this.prisma.apiKey.findUnique({
        where: { keyHash },
      })

      if (!apiKey) {
        this.logger.warn('API key not found')
        return null
      }

      if (!apiKey.isActive) {
        this.logger.warn(`API key ${apiKey.id} is inactive`)
        return null
      }

      if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        this.logger.warn(`API key ${apiKey.id} has expired`)
        return null
      }

      // Update usage statistics (fire and forget to avoid blocking)
      this.updateUsageStats(apiKey.id).catch((err) => {
        this.logger.error(
          `Failed to update usage stats for key ${apiKey.id}`,
          err,
        )
      })

      return {
        id: apiKey.id,
        name: apiKey.name,
        channelToken: apiKey.channelToken,
        createdById: apiKey.createdById,
        metadata: apiKey.metadata as Record<string, any> | undefined,
      }
    } catch (error) {
      this.logger.error('Error validating API key', error?.stack)
      return null
    }
  }

  async revokeApiKey(ctx: RequestContext, id: string): Promise<ApiKeyEntity> {
    const { channel } = ctx

    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        id,
        channelToken: channel.token,
      },
    })

    if (!apiKey) {
      throw new NotFoundException('API key not found')
    }

    const updated = await this.prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
      include: {
        createdBy: true,
      },
    })

    this.logger.log(`API Key revoked: ${id} for channel ${channel.token}`)

    return updated as unknown as ApiKeyEntity
  }

  async listApiKeys(ctx: RequestContext): Promise<ApiKeyEntity[]> {
    const { channel } = ctx

    const apiKeys = await this.prisma.apiKey.findMany({
      where: {
        channelToken: channel.token,
      },
      include: {
        createdBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return apiKeys as unknown as ApiKeyEntity[]
  }

  async getApiKeyById(
    ctx: RequestContext,
    id: string,
  ): Promise<ApiKeyEntity | null> {
    const { channel } = ctx

    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        id,
        channelToken: channel.token,
      },
      include: {
        createdBy: true,
      },
    })

    return apiKey as unknown as ApiKeyEntity | null
  }

  private generateRandomKey(): string {
    // Generate a secure random key
    // Format: mk_live_<32 random characters>
    const randomBytes = crypto.randomBytes(24)
    const randomString = randomBytes.toString('base64url')
    return `mk_live_${randomString}`
  }

  private hashKey(plainKey: string): string {
    return crypto.createHash('sha256').update(plainKey).digest('hex')
  }

  private async updateUsageStats(
    apiKeyId: string,
    ipAddress?: string,
  ): Promise<void> {
    await this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
        ...(ipAddress && { lastUsedIp: ipAddress }),
      },
    })
  }

  async updateUsageStatsWithIp(
    apiKeyId: string,
    ipAddress: string,
  ): Promise<void> {
    return this.updateUsageStats(apiKeyId, ipAddress)
  }
}
