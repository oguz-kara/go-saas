// src/modules/user/application/services/user.service.ts
import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { DEFAULT_PAGE } from 'src/common/constants/default-pagination-values'
import { UserEntity } from '../../api/graphql/entities/user.entity'
import { DEFAULT_PAGE_SIZE } from 'src/common/constants/default-pagination-values'
import { EntityNotFoundException } from 'src/common/exceptions'
import { UpdateUserProfileInput } from '../../api/graphql/dto/update-user-profile.input'
import { ChangePasswordInput } from '../../api/graphql/dto/change-password.input'
import { ChangePasswordOutput } from '../../api/graphql/dto/change-password.output'
import * as bcrypt from 'bcryptjs'

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

  async updateUserProfile(
    ctx: RequestContext,
    input: UpdateUserProfileInput,
  ): Promise<UserEntity> {
    const { channel, user: contextUser } = ctx

    if (!channel.token) {
      throw new UnauthorizedException('User channel could not be identified.')
    }

    if (!contextUser?.id) {
      throw new UnauthorizedException('User not authenticated.')
    }

    // Verify user exists and belongs to the same channel
    const user = await this.prisma.user.findUnique({
      where: {
        id: contextUser.id,
        channelToken: channel.token,
      },
    })

    if (!user) {
      throw new EntityNotFoundException('User', contextUser.id)
    }

    // Update the user's name
    const updatedUser = await this.prisma.user.update({
      where: { id: contextUser.id },
      data: {
        name: input.name,
      },
    })

    this.logger.log(`User profile updated: ${updatedUser.id}`)

    return updatedUser as UserEntity
  }

  async changePassword(
    ctx: RequestContext,
    input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    const { channel, user: contextUser } = ctx

    if (!channel.token) {
      throw new UnauthorizedException('User channel could not be identified.')
    }

    if (!contextUser?.id) {
      throw new UnauthorizedException('User not authenticated.')
    }

    // Validate that new password and confirm password match
    if (input.newPassword !== input.confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match')
    }

    // Get user with password
    const user = await this.prisma.user.findUnique({
      where: {
        id: contextUser.id,
        channelToken: channel.token,
      },
    })

    if (!user) {
      throw new EntityNotFoundException('User', contextUser.id)
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      input.currentPassword,
      user.password,
    )

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect')
    }

    // Hash new password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(input.newPassword, saltRounds)

    // Update password
    await this.prisma.user.update({
      where: { id: contextUser.id },
      data: {
        password: hashedPassword,
      },
    })

    this.logger.log(`Password changed for user: ${user.id}`)

    return {
      success: true,
      message: 'Password changed successfully',
    }
  }
}
