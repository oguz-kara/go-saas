// src/modules/attribute-value/api/graphql/dto/get-attribute-values.args.ts
import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { ListQueryArgs } from 'src/common/graphql/dto/list-query.args'

@ArgsType()
export class GetAttributeValuesArgs extends ListQueryArgs {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID() // ID'lerin UUID olduğunu varsayarak
  attributeTypeId: string
}
