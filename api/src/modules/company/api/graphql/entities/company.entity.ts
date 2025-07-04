import { ObjectType, Field, ID } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { CompanyNoteEntity } from './company-note.entity'
import { AttributeValueEntity } from 'src/modules/attribute/api/graphql/entities/attribute.entity'

@ObjectType('Company')
export class CompanyEntity {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  website?: string | null

  @Field(() => String, { nullable: true })
  taxId?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => GraphQLJSON, { nullable: true })
  address?: Record<string, any> | null

  @Field(() => String, { nullable: true })
  phoneNumber?: string | null

  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => String, { nullable: true })
  linkedinUrl?: string | null

  @Field(() => GraphQLJSON, { nullable: true })
  socialProfiles?: Record<string, any> | null

  @Field(() => String, { nullable: true })
  channelToken?: string | null

  @Field(() => [CompanyNoteEntity], { nullable: true })
  notes?: CompanyNoteEntity[]

  @Field(() => [AttributeValueEntity], { nullable: true })
  attributes?: AttributeValueEntity[]

  @Field(() => [String], {
    nullable: true,
    description:
      'Şirketin hiyerarşik adres kodları (örn: ["turkiye", "izmir"])',
  })
  addressAttributeCodes?: string[]

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | null
}
