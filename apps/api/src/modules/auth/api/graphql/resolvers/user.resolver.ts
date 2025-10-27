import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { UserEntity } from '../entities/user.entity'
import { UserService } from 'src/modules/auth/application/services/user.service'
import { UserConnectionObject } from '../dto/user-connection.object-type'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { UpdateUserProfileInput } from '../dto/update-user-profile.input'
import { ChangePasswordInput } from '../dto/change-password.input'
import { ChangePasswordOutput } from '../dto/change-password.output'

@Resolver(() => UserEntity)
@ProtectResource()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserConnectionObject, { name: 'getUsers' })
  async getUsers(
    @Ctx() ctx: RequestContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<UserConnectionObject> {
    return this.userService.getUsers(ctx, { skip, take })
  }

  @Query(() => UserEntity, { name: 'getUser' })
  async getUser(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
  ): Promise<UserEntity | null> {
    return this.userService.getUser(ctx, id)
  }

  @Query(() => UserEntity, { name: 'getUserByEmail' })
  async getUserByEmail(
    @Ctx() ctx: RequestContext,
    @Args('email') email: string,
  ): Promise<UserEntity | null> {
    return this.userService.getUserByEmail(ctx, email)
  }

  @Mutation(() => UserEntity, { name: 'updateUserProfile' })
  async updateUserProfile(
    @Ctx() ctx: RequestContext,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<UserEntity> {
    return this.userService.updateUserProfile(ctx, input)
  }

  @Mutation(() => ChangePasswordOutput, { name: 'changePassword' })
  async changePassword(
    @Ctx() ctx: RequestContext,
    @Args('input') input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    return this.userService.changePassword(ctx, input)
  }
}
