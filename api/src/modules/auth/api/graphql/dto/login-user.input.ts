import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@InputType()
export class LoginUserInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string

  @Field()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string
}
