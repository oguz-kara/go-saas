// src/modules/attribute-type/api/graphql/resolvers/attribute-type.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { AttributeTypeEntity } from '../entities/attribute-type.entity'
import { CreateAttributeTypeInput } from '../dto/create-attribute-type.input'
import { UpdateAttributeTypeInput } from '../dto/update-attribute-type.input'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { AttributeTypeService } from 'src/modules/attribute/application/services/attribute-type.service'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { ListQueryArgs } from 'src/common/graphql/dto/list-query.args'
import { AttributeTypeConnection } from '../dto/attribute-type-connection.object-type'

@Resolver(() => AttributeTypeEntity)
@ProtectResource()
export class AttributeTypeResolver {
  constructor(private readonly attributeTypeService: AttributeTypeService) {}

  @Mutation(() => AttributeTypeEntity, {
    name: 'createAttributeType',
  })
  async createAttributeType(
    @Ctx() ctx: RequestContext,
    @Args('createAttributeTypeInput') input: CreateAttributeTypeInput,
  ): Promise<Partial<AttributeTypeEntity>> {
    return await this.attributeTypeService.create(ctx, input)
  }

  @Query(() => AttributeTypeConnection, { name: 'attributeTypes' })
  async getAttributeTypes(
    @Ctx() ctx: RequestContext,
    @Args('args', { type: () => ListQueryArgs, nullable: true })
    args: ListQueryArgs,
  ): Promise<{
    items: Partial<AttributeTypeEntity>[]
    totalCount: number
  }> {
    return await this.attributeTypeService.findAll(ctx, args)
  }

  @Mutation(() => AttributeTypeEntity, { name: 'updateAttributeType' })
  async updateAttributeType(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('updateAttributeTypeInput') input: UpdateAttributeTypeInput,
  ): Promise<Partial<AttributeTypeEntity>> {
    return await this.attributeTypeService.update(ctx, id, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAttributeType' }) // Genellikle success durumu döndürmek yeterlidir
  async deleteAttributeType(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    const result = await this.attributeTypeService.delete(ctx, id)
    return result.success
  }
}
