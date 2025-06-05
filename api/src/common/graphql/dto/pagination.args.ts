// src/common/dto/pagination.args.ts
import { ArgsType, Field, Int } from '@nestjs/graphql'
import { Min, IsOptional } from 'class-validator'

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, description: 'Number of items to skip' })
  @IsOptional()
  @Min(0)
  skip?: number = 0

  @Field(() => Int, { nullable: true, description: 'Number of items to take' })
  @IsOptional()
  @Min(1)
  take?: number = 10
}
