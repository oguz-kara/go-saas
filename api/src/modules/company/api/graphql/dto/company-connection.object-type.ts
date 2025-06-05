import { ObjectType, Field, Int } from '@nestjs/graphql'
import { CompanyEntity } from '../entities/company.entity'

@ObjectType('CompanyConnection')
export class CompanyConnectionObject {
  @Field(() => [CompanyEntity])
  items: CompanyEntity[]

  @Field(() => Int)
  totalCount: number
}
