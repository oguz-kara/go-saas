// src/modules/attribute-group/api/graphql/resolvers/attribute-group.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { UsePipes, ValidationPipe } from '@nestjs/common'
import { AttributeGroupService } from '../../../application/services/attribute-group.service'
import { AttributeGroupEntity } from '../entities/attribute-group.entity'
import { CreateAttributeGroupInput } from '../dto/create-attribute-group.input'
import { UpdateAttributeGroupInput } from '../dto/update-attribute-group.input'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { AttributeGroupConnection } from '../dto/attribute-group-connection.object-type'
import { ListQueryArgs } from 'src/common/graphql/dto/list-query.args'

@Resolver(() => AttributeGroupEntity)
@ProtectResource()
export class AttributeGroupResolver {
  constructor(private readonly attributeGroupService: AttributeGroupService) {}

  @Mutation(() => AttributeGroupEntity, { name: 'createAttributeGroup' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createAttributeGroup(
    @Ctx() ctx: RequestContext,
    @Args('createAttributeGroupInput') input: CreateAttributeGroupInput,
  ): Promise<AttributeGroupEntity> {
    return this.attributeGroupService.create(ctx, input)
  }

  @Query(() => AttributeGroupConnection, { name: 'attributeGroups' })
  async getAttributeGroups(
    @Ctx() ctx: RequestContext,
    @Args() listQueryArgs: ListQueryArgs,
  ): Promise<AttributeGroupConnection> {
    return this.attributeGroupService.findAll(ctx, listQueryArgs)
  }

  @Mutation(() => AttributeGroupEntity, { name: 'updateAttributeGroup' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateAttributeGroup(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('updateAttributeGroupInput') input: UpdateAttributeGroupInput,
  ): Promise<AttributeGroupEntity> {
    return this.attributeGroupService.update(ctx, id, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAttributeGroup' })
  async deleteAttributeGroup(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    const result = await this.attributeGroupService.delete(ctx, id)
    return result.success
  }
}
