import { ObjectType, Field, Int } from '@nestjs/graphql'
import { LeadEntity } from '../entities/lead.entity'

@ObjectType('LeadConnection')
export class LeadConnectionObject {
  @Field(() => [LeadEntity])
  items: LeadEntity[]

  @Field(() => Int)
  totalCount: number
}
