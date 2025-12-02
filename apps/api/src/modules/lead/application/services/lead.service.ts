import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/common'
import { CreateLeadInput } from '../../api/graphql/dto/create-lead.input'
import { UpdateLeadInput } from '../../api/graphql/dto/update-lead.input'
import { LeadsFilterArgs } from '../../api/graphql/args/leads-filter.args'
import { LeadEntity } from '../../api/graphql/entities/lead.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { RequestContext } from 'src/common/request-context/request-context'

export interface LeadCreatedEventPayload {
  leadId: string
  source: string
  createdBy?: string | null
  channelId?: string | null
}

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createLead(
    ctx: RequestContext,
    input: CreateLeadInput,
    channelToken?: string,
  ): Promise<LeadEntity> {
    const { user, channel } = ctx
    const ct = channelToken ? channelToken : channel.token

    try {
      const lead = await this.prisma.lead.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone ?? null,
          company: input.company ?? null,
          jobTitle: input.jobTitle ?? null,
          website: input.website ?? null,
          status: (input.status as any) ?? 'NEW',
          source: input.source as any,
          priority: (input.priority as any) ?? 'MEDIUM',
          productInterest: (input.productInterest as any) ?? [],
          budget: input.budget ? new Prisma.Decimal(input.budget) : null,
          timeline: input.timeline ?? null,
          companySize: input.companySize ?? null,
          isDecisionMaker: input.isDecisionMaker ?? false,
          painPoints: input.painPoints ?? null,
          currentSolution: input.currentSolution ?? null,
          assignedToId: input.assignedToId ?? null,
        },
      })

      this.eventEmitter.emit('lead.created', {
        leadId: lead.id,
        source: lead.source,
        createdBy: user?.id ?? null,
        channelId: ct ?? null,
      } as LeadCreatedEventPayload)

      return lead as unknown as LeadEntity
    } catch (error) {
      this.logger.error('Failed to create lead', error?.stack)
      throw new InternalServerErrorException('Could not create lead.')
    }
  }

  async updateLead(
    ctx: RequestContext,
    input: UpdateLeadInput,
  ): Promise<LeadEntity> {
    try {
      const lead = await this.prisma.lead.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName ?? undefined,
          lastName: input.lastName ?? undefined,
          email: input.email ?? undefined,
          phone: input.phone ?? undefined,
          company: input.company ?? undefined,
          jobTitle: input.jobTitle ?? undefined,
          website: input.website ?? undefined,
          status: (input.status as any) ?? undefined,
          source: (input.source as any) ?? undefined,
          priority: (input.priority as any) ?? undefined,
          productInterest: (input.productInterest as any) ?? undefined,
          budget: input.budget ? new Prisma.Decimal(input.budget) : undefined,
          timeline: input.timeline ?? undefined,
          companySize: input.companySize ?? undefined,
          isDecisionMaker: input.isDecisionMaker ?? undefined,
          painPoints: input.painPoints ?? undefined,
          currentSolution: input.currentSolution ?? undefined,
          assignedToId: input.assignedToId ?? undefined,
        },
      })
      return lead as unknown as LeadEntity
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Lead not found')
      }
      this.logger.error('Failed to update lead', error?.stack)
      throw new InternalServerErrorException('Could not update lead.')
    }
  }

  async deleteLead(ctx: RequestContext, id: string): Promise<LeadEntity> {
    try {
      const lead = await this.prisma.lead.delete({ where: { id } })
      return lead as unknown as LeadEntity
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Lead not found')
      }
      this.logger.error('Failed to delete lead', error?.stack)
      throw new InternalServerErrorException('Could not delete lead.')
    }
  }

  async getLeads(
    ctx: RequestContext,
    args: LeadsFilterArgs,
  ): Promise<{ items: LeadEntity[]; totalCount: number }> {
    const {
      skip = 0,
      take = 10,
      searchQuery,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      source,
      priority,
      assignedToId,
      startDate,
      endDate,
    } = args

    const where: Prisma.LeadWhereInput = {}

    if (searchQuery) {
      where.OR = [
        { firstName: { contains: searchQuery, mode: 'insensitive' } },
        { lastName: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
        { company: { contains: searchQuery, mode: 'insensitive' } },
      ]
    }

    if (status && status.length) where.status = { in: status as any }
    if (source && source.length) where.source = { in: source as any }
    if (priority && priority.length) where.priority = { in: priority as any }
    if (assignedToId) where.assignedToId = assignedToId

    if (startDate || endDate) {
      where.createdAt = {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      }
    }

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.lead.count({ where }),
    ])

    return { items: items as unknown as LeadEntity[], totalCount }
  }

  async getLeadById(
    ctx: RequestContext,
    id: string,
  ): Promise<LeadEntity | null> {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    })
    return (lead as unknown as LeadEntity) ?? null
  }
}
