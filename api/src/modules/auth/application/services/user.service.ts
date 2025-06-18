// src/modules/user/application/services/user.service.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { DEFAULT_PAGE } from 'src/common/constants/default-pagination-values'
import { UserEntity } from '../../api/graphql/entities/user.entity'
import { DEFAULT_PAGE_SIZE } from 'src/common/constants/default-pagination-values'
import { EntityNotFoundException } from 'src/common/exceptions'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  // JwtService ve ConfigService kaldırıldı. CacheService ve ChannelService kullanılmadığı için şimdilik kaldırılabilir.
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(
    ctx: RequestContext,
    params?: { skip?: number; take?: number },
  ): Promise<{ totalCount: number; items: UserEntity[] }> {
    const { channel } = ctx

    if (!channel.token) {
      throw new UnauthorizedException('User channel could not be identified.')
    }

    const { skip = DEFAULT_PAGE, take = DEFAULT_PAGE_SIZE } = params || {}

    const where = { channelToken: channel.token }

    const [totalCount, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({ where, skip, take }),
    ])

    return { totalCount, items: users as UserEntity[] }
  }

  async getUser(ctx: RequestContext, id: string): Promise<UserEntity> {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('User channel could not be identified.')
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
        channelToken: channel.token, // GÜVENLİK: Sadece kendi kanalındaki kullanıcıyı getirebilir.
      },
    })

    if (!user) {
      throw new EntityNotFoundException('User', id)
    }

    return user as UserEntity
  }

  async getUserByEmail(
    ctx: RequestContext,
    email: string,
  ): Promise<UserEntity | null> {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('User channel could not be identified.')
    }

    const user = await this.prisma.user.findFirst({
      // findFirst kullanmak daha uygun
      where: {
        email,
        channelToken: channel.token, // GÜVENLİK: Sadece kendi kanalındaki kullanıcıyı getirebilir.
      },
    })

    return user as UserEntity | null
  }
}
