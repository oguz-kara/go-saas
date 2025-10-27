import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { LeadService } from 'src/modules/lead/application/services/lead.service'
import { LeadEntity } from '../entities/lead.entity'
import { CreateLeadInput } from '../dto/create-lead.input'
import { UpdateLeadInput } from '../dto/update-lead.input'
import { LeadsFilterArgs } from '../args/leads-filter.args'
import { LeadConnectionObject as LeadConnection } from '../dto/lead-connection.object-type'
import { UserEntity } from 'src/modules/auth/api/graphql/entities/user.entity'
import { ActivityEntity } from '../entities/activity.entity'
import { NoteEntity } from '../entities/note.entity'
import { TagEntity } from '../entities/tag.entity'
import { PrismaService } from 'src/common'

@Resolver(() => LeadEntity)
@ProtectResource()
export class LeadResolver {
  constructor(
    private readonly leadService: LeadService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => LeadEntity, { name: 'createLead' })
  async createLead(
    @Ctx() ctx: RequestContext,
    @Args('createLeadInput') createLeadInput: CreateLeadInput,
  ): Promise<LeadEntity> {
    return this.leadService.createLead(ctx, createLeadInput)
  }

  @Mutation(() => LeadEntity, { name: 'updateLead' })
  async updateLead(
    @Ctx() ctx: RequestContext,
    @Args('updateLeadInput') updateLeadInput: UpdateLeadInput,
  ): Promise<LeadEntity> {
    return this.leadService.updateLead(ctx, updateLeadInput)
  }

  @Mutation(() => LeadEntity, { name: 'deleteLead' })
  async deleteLead(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<LeadEntity> {
    return this.leadService.deleteLead(ctx, id)
  }

  @Query(() => LeadConnection, { name: 'leads' })
  async getLeads(
    @Ctx() ctx: RequestContext,
    @Args() leadsFilterArgs: LeadsFilterArgs,
  ): Promise<LeadConnection> {
    return this.leadService.getLeads(ctx, leadsFilterArgs)
  }

  @Query(() => LeadEntity, { name: 'lead', nullable: true })
  async getLead(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<LeadEntity | null> {
    return this.leadService.getLeadById(ctx, id)
  }

  @ResolveField('assignedTo', () => UserEntity, { nullable: true })
  async resolveAssignedTo(
    @Parent() lead: LeadEntity,
  ): Promise<UserEntity | null> {
    // If assignedToId is not set, return null immediately
    if (!lead.assignedToId) {
      return null
    }

    // If assignedTo is already loaded (from include), return it
    if (lead.assignedTo) {
      return lead.assignedTo
    }

    // Otherwise, fetch it on demand
    const user = await this.prisma.user.findUnique({
      where: { id: lead.assignedToId },
    })
    return user as unknown as UserEntity
  }

  @ResolveField('activities', () => [ActivityEntity])
  async resolveActivities(
    @Parent() lead: LeadEntity,
    @Args('skip', { type: () => Number, nullable: true }) skip?: number,
    @Args('take', { type: () => Number, nullable: true }) take?: number,
  ): Promise<ActivityEntity[]> {
    const items = await this.prisma.activity.findMany({
      where: { leadId: lead.id },
      orderBy: { createdAt: 'desc' },
      skip: skip ?? 0,
      take: take ?? 10,
    })
    return items as unknown as ActivityEntity[]
  }

  @ResolveField('activitiesCount', () => Number)
  async resolveActivitiesCount(@Parent() lead: LeadEntity): Promise<number> {
    return this.prisma.activity.count({ where: { leadId: lead.id } })
  }

  @ResolveField('notes', () => [NoteEntity])
  async resolveNotes(
    @Parent() lead: LeadEntity,
    @Args('skip', { type: () => Number, nullable: true }) skip?: number,
    @Args('take', { type: () => Number, nullable: true }) take?: number,
  ): Promise<NoteEntity[]> {
    const items = await this.prisma.note.findMany({
      where: { leadId: lead.id },
      orderBy: { createdAt: 'desc' },
      skip: skip ?? 0,
      take: take ?? 10,
    })
    return items as unknown as NoteEntity[]
  }

  @ResolveField('notesCount', () => Number)
  async resolveNotesCount(@Parent() lead: LeadEntity): Promise<number> {
    return this.prisma.note.count({ where: { leadId: lead.id } })
  }

  @ResolveField('tags', () => [TagEntity])
  async resolveTags(@Parent() lead: LeadEntity): Promise<TagEntity[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        leads: {
          some: {
            id: lead.id,
          },
        },
      },
    })
    return tags as unknown as TagEntity[]
  }

  @ResolveField('tagsCount', () => Number)
  async resolveTagsCount(@Parent() lead: LeadEntity): Promise<number> {
    return this.prisma.tag.count({
      where: {
        leads: {
          some: {
            id: lead.id,
          },
        },
      },
    })
  }
}
