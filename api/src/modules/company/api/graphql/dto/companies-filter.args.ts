import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { PaginationArgs } from 'src/common/graphql'

@ArgsType()
export class CompaniesFilterArgs extends PaginationArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  channelToken?: string
}
