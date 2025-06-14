// src/modules/attribute-value/api/graphql/resolvers/attribute-value.resolver.ts
import {
  Resolver,
  Query,
  Args,
  Mutation,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { AttributeValueEntity } from '../entities/attribute.entity'
import { AttributeService } from 'src/modules/attribute/application/services/attribute.service'
import { CreateAttributeInput } from '../dto/create-attribute.input'
import { UpdateAttributeInput } from '../dto/update-attribute.input'
import { CompanyEntity } from 'src/modules/company/api/graphql/entities/company.entity'
import { AttributeWithTypeEntity } from '../dto/attribute-with-type.object-type'
import { GetAttributeValuesArgs } from '../args/get-attribute-values.args'
import { AttributeValueConnection } from '../dto/attribute-value-connection.object-type'

@Resolver(() => AttributeValueEntity)
@ProtectResource()
export class AttributeResolver {
  constructor(private readonly attributeService: AttributeService) {}

  @Query(() => AttributeValueConnection, { name: 'attributeValues' })
  async getAttributeValues(
    @Ctx() ctx: RequestContext,
    @Args() args: GetAttributeValuesArgs,
  ): Promise<AttributeValueConnection> {
    return await this.attributeService.getValues(ctx, args)
  }

  @Mutation(() => AttributeValueEntity, { name: 'createAttribute' })
  async createAttribute(
    @Ctx() ctx: RequestContext,
    @Args('createAttributeInput') input: CreateAttributeInput,
  ): Promise<AttributeValueEntity> {
    return this.attributeService.create(ctx, input)
  }

  @Mutation(() => AttributeValueEntity, { name: 'updateAttribute' })
  async updateAttribute(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('updateAttributeInput') input: UpdateAttributeInput,
  ): Promise<AttributeValueEntity> {
    return this.attributeService.update(ctx, id, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAttribute' })
  async deleteAttribute(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    const result = await this.attributeService.delete(ctx, id)
    return result.success
  }
}

@Resolver(() => CompanyEntity)
@ProtectResource()
export class AttributeWithTypeResolver {
  constructor(private readonly attributeService: AttributeService) {}

  @ResolveField(() => [AttributeWithTypeEntity], { name: 'attributes' })
  async attributes(
    @Parent() company: CompanyEntity,
    @Ctx() ctx: RequestContext,
  ): Promise<AttributeWithTypeEntity[]> {
    return await this.attributeService.getCompanyAttributes(ctx, company.id)
  }
}
