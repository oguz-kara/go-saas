// src/common/dto/pagination.args.ts
import { ArgsType, Field, InputType, Int } from '@nestjs/graphql'
import { Min, IsOptional } from 'class-validator'

@ArgsType()
@InputType()
export class ListQueryArgs {
  @Field(() => Int, { nullable: true, description: 'Number of items to skip' })
  @IsOptional()
  @Min(0)
  skip?: number = 0

  @Field(() => Int, { nullable: true, description: 'Number of items to take' })
  @IsOptional()
  @Min(1)
  take?: number = 10

  @Field(() => String, { nullable: true, description: 'Search query' })
  @IsOptional()
  searchQuery?: string
}
