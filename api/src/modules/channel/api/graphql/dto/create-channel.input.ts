import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

@InputType()
export class CreateChannelInput {
  @Field()
  @IsNotEmpty({ message: 'Channel name cannot be empty.' })
  @MaxLength(100)
  name: string

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(500)
  description?: string

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(100)
  token?: string
}
