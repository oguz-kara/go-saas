import { ObjectType, Field, ID } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { CompanyNoteEntity } from './company-note.entity'
import { AttributeWithTypeEntity } from 'src/modules/attribute/api/graphql/dto/attribute-with-type.object-type'

@ObjectType('Company')
export class CompanyEntity {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  website?: string | null

  @Field(() => String, { nullable: true })
  industry?: string | null

  @Field(() => String, { nullable: true })
  linkedinUrl?: string | null

  @Field(() => GraphQLJSON, { nullable: true })
  address?: Record<string, any>

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | null

  @Field(() => String, { nullable: true })
  channelToken?: string

  @Field(() => [CompanyNoteEntity], { nullable: true })
  notes?: CompanyNoteEntity[]

  @Field(() => [AttributeWithTypeEntity], { nullable: true })
  attributes?: AttributeWithTypeEntity[]
}
