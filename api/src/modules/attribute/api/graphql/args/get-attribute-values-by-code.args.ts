// src/modules/attribute-value/api/graphql/dto/get-attribute-values-by-code.args.ts
import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ListQueryArgs } from 'src/common/graphql/dto/list-query.args'

@ArgsType()
@InputType()
export class GetAttributeValuesByCodeArgs extends ListQueryArgs {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  attributeTypeCode: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  parentCode?: string | null
}
