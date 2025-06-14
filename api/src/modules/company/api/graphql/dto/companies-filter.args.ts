import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { ListQueryArgs } from 'src/common/graphql'

@ArgsType()
export class CompaniesFilterArgs extends ListQueryArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  channelToken?: string
}
