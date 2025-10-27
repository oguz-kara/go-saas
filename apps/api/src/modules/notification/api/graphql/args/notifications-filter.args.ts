import { ArgsType, Field } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'
import { ListQueryArgs } from 'src/common/graphql'

@ArgsType()
export class NotificationsFilterArgs extends ListQueryArgs {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  onlyUnread?: boolean
}


