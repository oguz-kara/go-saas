import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ActivityEntity } from '../entities/activity.entity'
import { ActivityService } from '../../../application/services/activity.service'
import { ActivitiesFilterArgs } from '../args/activities-filter.args'
import { CreateActivityInput } from '../dto/create-activity.input'
import { UpdateActivityInput } from '../dto/update-activity.input'

@Resolver(() => ActivityEntity)
@ProtectResource()
export class LeadActivityResolver {
  constructor(private readonly service: ActivityService) {}

  @Query(() => ActivityEntity, { name: 'activity', nullable: true })
  async activity(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ActivityEntity | null> {
    return this.service.getActivityById(ctx, id)
  }

  @Query(() => [ActivityEntity], { name: 'activities' })
  async activities(
    @Ctx() ctx: RequestContext,
    @Args() args: ActivitiesFilterArgs,
  ): Promise<ActivityEntity[]> {
    const { items } = await this.service.getActivities(ctx, args)
    return items
  }

  @Query(() => Number, { name: 'activitiesCount' })
  async activitiesCount(
    @Ctx() ctx: RequestContext,
    @Args() args: ActivitiesFilterArgs,
  ): Promise<number> {
    const { totalCount } = await this.service.getActivities(ctx, args)
    return totalCount
  }

  @Mutation(() => ActivityEntity, { name: 'createActivity' })
  async createActivity(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateActivityInput,
  ): Promise<ActivityEntity> {
    return this.service.createActivity(ctx, input)
  }

  @Mutation(() => ActivityEntity, { name: 'updateActivity' })
  async updateActivity(
    @Ctx() ctx: RequestContext,
    @Args('input') input: UpdateActivityInput,
  ): Promise<ActivityEntity> {
    return this.service.updateActivity(ctx, input)
  }

  @Mutation(() => ActivityEntity, { name: 'completeActivity' })
  async completeActivity(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ActivityEntity> {
    return this.service.completeActivity(ctx, id)
  }

  @Mutation(() => ActivityEntity, { name: 'deleteActivity' })
  async deleteActivity(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ActivityEntity> {
    return this.service.deleteActivity(ctx, id)
  }
}
