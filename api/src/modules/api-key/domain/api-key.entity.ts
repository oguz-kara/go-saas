import { ObjectType, Field, ID } from '@nestjs/graphql'
import { UserEntity } from 'src/modules/auth/api/graphql/entities/user.entity'

@ObjectType('ApiKey')
export class ApiKeyEntity {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  prefix: string

  @Field(() => Boolean)
  isActive: boolean

  @Field(() => Date, { nullable: true })
  expiresAt?: Date | null

  @Field(() => Number)
  usageCount: number

  @Field(() => Date, { nullable: true })
  lastUsedAt?: Date | null

  @Field(() => String, { nullable: true })
  lastUsedIp?: string | null

  @Field(() => String)
  channelToken: string

  @Field(() => UserEntity, { nullable: true })
  createdBy?: UserEntity

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}

@ObjectType('GeneratedApiKey')
export class GeneratedApiKeyEntity extends ApiKeyEntity {
  @Field(() => String)
  plainKey: string // Only returned once during generation
}


