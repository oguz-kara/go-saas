import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { ListQueryArgs } from 'src/common/graphql'
import { AttributeFilterInput } from './attribute-filter.input'

@ArgsType()
export class CompaniesFilterArgs extends ListQueryArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  channelToken?: string

  @Field(() => [AttributeFilterInput], { nullable: true })
  @IsOptional()
  filters?: AttributeFilterInput[]

  @Field(() => String, { nullable: true })
  @IsOptional()
  address?: string
}
