import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty({ message: 'Current password cannot be empty' })
  currentPassword: string

  @Field()
  @IsNotEmpty({ message: 'New password cannot be empty' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string

  @Field()
  @IsNotEmpty({ message: 'Confirm password cannot be empty' })
  confirmPassword: string
}

