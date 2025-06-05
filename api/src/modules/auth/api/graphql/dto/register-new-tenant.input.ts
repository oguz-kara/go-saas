import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class RegisterNewTenantInput {
  @Field()
  @IsNotEmpty({ message: 'User name cannot be empty' })
  userName: string

  @Field()
  @IsNotEmpty({ message: 'Tenant name cannot be empty' })
  tenantName: string

  @Field({ nullable: true })
  tenantDescription?: string

  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string

  @Field()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string
}
