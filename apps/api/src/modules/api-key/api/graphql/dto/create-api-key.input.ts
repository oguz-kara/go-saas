import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

@InputType()
export class CreateApiKeyInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string
}
