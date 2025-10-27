import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ApiKeyService } from '../../../application/services/api-key.service'
import {
  ApiKeyEntity,
  GeneratedApiKeyEntity,
} from '../../../domain/api-key.entity'
import { CreateApiKeyInput } from '../dto/create-api-key.input'

@Resolver(() => ApiKeyEntity)
@ProtectResource()
export class ApiKeyResolver {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Mutation(() => GeneratedApiKeyEntity, { name: 'createApiKey' })
  async createApiKey(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateApiKeyInput,
  ): Promise<GeneratedApiKeyEntity> {
    return this.apiKeyService.generateApiKey(ctx, input.name)
  }

  @Query(() => [ApiKeyEntity], { name: 'listApiKeys' })
  async listApiKeys(@Ctx() ctx: RequestContext): Promise<ApiKeyEntity[]> {
    return this.apiKeyService.listApiKeys(ctx)
  }

  @Query(() => ApiKeyEntity, { name: 'apiKey', nullable: true })
  async apiKey(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ApiKeyEntity | null> {
    return this.apiKeyService.getApiKeyById(ctx, id)
  }

  @Mutation(() => ApiKeyEntity, { name: 'revokeApiKey' })
  async revokeApiKey(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ApiKeyEntity> {
    return this.apiKeyService.revokeApiKey(ctx, id)
  }
}
