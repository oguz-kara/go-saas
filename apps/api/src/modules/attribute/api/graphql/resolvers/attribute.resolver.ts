// src/modules/attribute-value/api/graphql/resolvers/attribute-value.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { AttributeValueConnection } from '../dto/attribute-value-connection.object-type'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { AttributeValueEntity } from '../entities/attribute.entity'
import { AttributeTypeEntity } from '../entities/attribute-type.entity'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { AttributeService } from 'src/modules/attribute/application/services/attribute.service'
import { GetAttributeValuesArgs } from '../args/get-attribute-values.args'
import { CreateAttributeInput } from '../dto/create-attribute.input'
import { UpdateAttributeInput } from '../dto/update-attribute.input'
import { GetAttributeValuesByCodeArgs } from '../args/get-attribute-values-by-code.args'
import { PrismaService } from 'src/common'

@Resolver(() => AttributeValueEntity)
@ProtectResource()
export class AttributeResolver {
  constructor(
    private readonly attributeValueService: AttributeService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => AttributeValueConnection, { name: 'attributeValuesByCode' })
  async getAttributeValuesByCode(
    @Ctx() ctx: RequestContext,
    @Args('args') args: GetAttributeValuesByCodeArgs,
  ): Promise<AttributeValueConnection> {
    return (await this.attributeValueService.getValuesByCode(
      ctx,
      args,
    )) as unknown as AttributeValueConnection
  }

  @Query(() => AttributeValueConnection, { name: 'attributeValues' })
  async getAttributeValues(
    @Ctx() ctx: RequestContext,
    @Args() args: GetAttributeValuesArgs,
  ): Promise<AttributeValueConnection> {
    return (await this.attributeValueService.getValues(
      ctx,
      args,
    )) as unknown as AttributeValueConnection
  }

  @Mutation(() => AttributeValueEntity, { name: 'createAttributeValue' })
  async createAttributeValue(
    @Ctx() ctx: RequestContext,
    @Args('createAttributeValueInput') input: CreateAttributeInput,
  ): Promise<AttributeValueEntity> {
    return this.attributeValueService.create(ctx, input)
  }

  @Mutation(() => AttributeValueEntity, { name: 'updateAttributeValue' })
  async updateAttributeValue(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('updateAttributeValueInput') input: UpdateAttributeInput,
  ): Promise<AttributeValueEntity> {
    return this.attributeValueService.update(ctx, id, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAttributeValue' })
  async deleteAttributeValue(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    const result = await this.attributeValueService.delete(ctx, id)
    return result.success
  }

  @ResolveField('type', () => AttributeTypeEntity, { nullable: true })
  async resolveType(
    @Parent() attributeValue: AttributeValueEntity,
  ): Promise<AttributeTypeEntity | null> {
    // If type is already loaded (from mutations or includes), return it
    if (attributeValue.type) {
      return attributeValue.type
    }

    // Otherwise, fetch it on demand
    const type = await this.prisma.attributeType.findUnique({
      where: { id: attributeValue.attributeTypeId },
    })
    return type as unknown as AttributeTypeEntity
  }
}
