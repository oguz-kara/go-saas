// src/modules/attribute-type/api/graphql/resolvers/attribute-type.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { AttributeTypeEntity } from '../entities/attribute-type.entity'
import { AttributeGroupEntity } from '../entities/attribute-group.entity'
import { CreateAttributeTypeInput } from '../dto/create-attribute-type.input'
import { UpdateAttributeTypeInput } from '../dto/update-attribute-type.input'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { AttributeTypeService } from 'src/modules/attribute/application/services/attribute-type.service'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { ListQueryArgs } from 'src/common/graphql/dto/list-query.args'
import { PrismaService } from 'src/common'
import { AttributeTypeConnection } from '../dto/attribute-type-connection.object-type'
import { AttributableType } from '../enums/attributable-type.enum'

@Resolver(() => AttributeTypeEntity)
@ProtectResource()
export class AttributeTypeResolver {
  constructor(
    private readonly attributeTypeService: AttributeTypeService,
    private readonly prisma: PrismaService,
  ) {}

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
    @Args('includeSystemDefined', {
      type: () => Boolean,
      nullable: true,
      defaultValue: false,
    })
    includeSystemDefined: boolean,
  ): Promise<{
    items: Partial<AttributeTypeEntity>[]
    totalCount: number
  }> {
    return await this.attributeTypeService.findAll(ctx, {
      ...args,
      includeSystemDefined,
    })
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

  @ResolveField('group', () => AttributeGroupEntity, { nullable: true })
  async resolveGroup(
    @Parent() attributeType: AttributeTypeEntity,
  ): Promise<AttributeGroupEntity | null> {
    if (!attributeType.groupId) {
      return null
    }

    // If group is already loaded, return it
    if (attributeType.group) {
      return attributeType.group
    }

    // Otherwise, fetch it on demand
    const group = await this.prisma.attributeGroup.findUnique({
      where: { id: attributeType.groupId },
    })
    return group as unknown as AttributeGroupEntity
  }

  @ResolveField('availableFor', () => [AttributableType])
  async resolveAvailableFor(
    @Parent() attributeType: AttributeTypeEntity,
  ): Promise<AttributableType[]> {
    // If availableFor is already loaded and is an array of enum values, return it
    if (
      attributeType.availableFor &&
      Array.isArray(attributeType.availableFor) &&
      typeof attributeType.availableFor[0] === 'string'
    ) {
      return attributeType.availableFor
    }

    // Otherwise, fetch it on demand
    const availableForRecords =
      await this.prisma.attributeTypeToEntityType.findMany({
        where: { attributeTypeId: attributeType.id },
        select: { entityType: true },
      })

    return availableForRecords.map(
      (record) => record.entityType as AttributableType,
    )
  }
}
