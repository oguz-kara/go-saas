import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthenticationPayloadObject } from '../dto/authetication-payload.object-type'
import { AuthService } from 'src/modules/auth/application/services/auth.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { RegisterUserInput } from '../dto/register-user.input'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { LoginUserInput } from '../dto/login-user.input'
import { LogoutOutput } from '../dto/logout.output'
import { UserEntity } from '../entities/user.entity'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { RegisterNewTenantInput } from '../dto/register-new-tenant.input'

@Resolver(() => AuthenticationPayloadObject)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthenticationPayloadObject, { name: 'registerUser' })
  async registerUser(
    @Ctx() ctx: RequestContext,
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
    @Args('channelToken') channelToken: string,
  ): Promise<AuthenticationPayloadObject> {
    return this.authService.registerUser(ctx, registerUserInput, channelToken)
  }

  @Mutation(() => AuthenticationPayloadObject, { name: 'registerNewTenant' })
  async registerNewTenant(
    @Ctx() ctx: RequestContext,
    @Args('registerNewTenantInput')
    registerNewTenantInput: RegisterNewTenantInput,
  ): Promise<AuthenticationPayloadObject> {
    return this.authService.registerNewTenant(ctx, registerNewTenantInput)
  }

  @Mutation(() => AuthenticationPayloadObject, { name: 'loginUser' })
  async loginUser(
    @Ctx() ctx: RequestContext,
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<AuthenticationPayloadObject> {
    return this.authService.login(ctx, loginUserInput)
  }

  @Mutation(() => LogoutOutput, { name: 'logoutUser' })
  @ProtectResource()
  async logoutUser(@Ctx() ctx: RequestContext): Promise<LogoutOutput> {
    return this.authService.logout(ctx)
  }

  @ProtectResource()
  @Query(() => UserEntity, { name: 'me', nullable: true })
  async me(@Ctx() ctx: RequestContext): Promise<UserEntity | null> {
    return this.authService.me(ctx)
  }
}
