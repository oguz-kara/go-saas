import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService, RequestContext } from 'src/common'
import { ActivitiesFilterArgs } from '../../api/graphql/args/activities-filter.args'
import { CreateActivityInput } from '../../api/graphql/dto/create-activity.input'
import { UpdateActivityInput } from '../../api/graphql/dto/update-activity.input'
import { ActivityEntity } from '../../api/graphql/entities/activity.entity'

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name)

  constructor(private readonly prisma: PrismaService) {}

  async createActivity(
    ctx: RequestContext,
    input: CreateActivityInput,
  ): Promise<ActivityEntity> {
    const userId = ctx.user?.id
    if (!userId) throw new InternalServerErrorException('User context invalid')

    const scheduledAt = input.scheduledAt
      ? new Date(input.scheduledAt)
      : undefined

    const created = await this.prisma.activity.create({
      data: {
        type: input.type,
        subject: input.subject,
        description: input.description ?? null,
        scheduledAt: scheduledAt ?? null,
        leadId: input.leadId,
        userId,
      },
    })
    return created as unknown as ActivityEntity
  }

  async updateActivity(
    ctx: RequestContext,
    input: UpdateActivityInput,
  ): Promise<ActivityEntity> {
    try {
      const updated = await this.prisma.activity.update({
        where: { id: input.id },
        data: {
          type: input.type ?? undefined,
          subject: input.subject ?? undefined,
          description: input.description ?? undefined,
          scheduledAt: input.scheduledAt
            ? new Date(input.scheduledAt)
            : undefined,
        },
      })
      return updated as unknown as ActivityEntity
    } catch (error) {
      if (error?.code === 'P2025')
        throw new NotFoundException('Activity not found')
      this.logger.error('Failed to update activity', error?.stack)
      throw new InternalServerErrorException('Could not update activity')
    }
  }

  async completeActivity(
    ctx: RequestContext,
    id: string,
  ): Promise<ActivityEntity> {
    try {
      const updated = await this.prisma.activity.update({
        where: { id },
        data: { completedAt: new Date() },
      })
      return updated as unknown as ActivityEntity
    } catch (error) {
      if (error?.code === 'P2025')
        throw new NotFoundException('Activity not found')
      throw new InternalServerErrorException('Could not complete activity')
    }
  }

  async deleteActivity(
    ctx: RequestContext,
    id: string,
  ): Promise<ActivityEntity> {
    try {
      const deleted = await this.prisma.activity.delete({ where: { id } })
      return deleted as unknown as ActivityEntity
    } catch (error) {
      if (error?.code === 'P2025')
        throw new NotFoundException('Activity not found')
      throw new InternalServerErrorException('Could not delete activity')
    }
  }

  async getActivityById(
    ctx: RequestContext,
    id: string,
  ): Promise<ActivityEntity | null> {
    const act = await this.prisma.activity.findUnique({ where: { id } })
    return (act as unknown as ActivityEntity) ?? null
  }

  async getActivities(
    ctx: RequestContext,
    args: ActivitiesFilterArgs,
  ): Promise<{ items: ActivityEntity[]; totalCount: number }> {
    const where: any = {}
    if (args.leadId) where.leadId = args.leadId
    if (args.userId) where.userId = args.userId
    if (args.type) where.type = args.type
    if (args.isCompleted !== undefined) {
      where.completedAt = args.isCompleted ? { not: null } : null
    }
    if (args.startDate || args.endDate) {
      where.createdAt = {
        gte: args.startDate ? new Date(args.startDate) : undefined,
        lte: args.endDate ? new Date(args.endDate) : undefined,
      }
    }

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.activity.findMany({
        where,
        skip: args.skip ?? 0,
        take: args.take ?? 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activity.count({ where }),
    ])

    return { items: items as unknown as ActivityEntity[], totalCount }
  }

  async getActivitiesCount(
    ctx: RequestContext,
    args: ActivitiesFilterArgs,
  ): Promise<number> {
    const { totalCount } = await this.getActivities(ctx, { ...args, take: 0 })
    return totalCount
  }
}
