import { Injectable, Logger } from '@nestjs/common'
import { Command } from 'nestjs-command'
import { PrismaService } from 'src/common'
import { leadsToSeed } from '../data/lead.seed-data'

@Injectable()
export class SeedLeadsSeeder {
  private readonly logger = new Logger(SeedLeadsSeeder.name)

  constructor(private readonly prisma: PrismaService) {}

  @Command({
    command: 'seed:leads',
    describe: 'Seeds the database with initial leads',
  })
  async seedInitialLeads(): Promise<void> {
    this.logger.log('--- STARTING LEAD SEEDER ---')
    this.logger.log(`Seeding ${leadsToSeed.length} leads...`)

    // Ensure referenced users exist (idempotent check)
    const referencedUserIds = Array.from(
      new Set(
        leadsToSeed
          .map((l) => l.assignedToId)
          .filter((id): id is string => typeof id === 'string'),
      ),
    )

    const existingUsers = await this.prisma.user.findMany({
      where: { id: { in: referencedUserIds } },
      select: { id: true },
    })
    const existingUserIds = new Set(existingUsers.map((u) => u.id))

    const payload = leadsToSeed.map((l) => ({
      ...l,
      assignedToId:
        l.assignedToId && existingUserIds.has(l.assignedToId)
          ? l.assignedToId
          : null,
    }))

    // Upsert by email to keep idempotency
    for (const lead of payload) {
      await this.prisma.lead.upsert({
        where: { email: lead.email },
        update: {
          firstName: lead.firstName,
          lastName: lead.lastName,
          phone: lead.phone ?? null,
          company: lead.company ?? null,
          jobTitle: lead.jobTitle ?? null,
          website: lead.website ?? null,
          status: lead.status,
          source: lead.source,
          priority: lead.priority,
          productInterest: lead.productInterest,
          budget: lead.budget ?? null,
          timeline: lead.timeline ?? null,
          companySize: lead.companySize ?? null,
          isDecisionMaker: lead.isDecisionMaker ?? false,
          painPoints: lead.painPoints ?? null,
          currentSolution: lead.currentSolution ?? null,
          lastContactedAt: lead.lastContactedAt ?? null,
          convertedAt: lead.convertedAt ?? null,
          lostReason: lead.lostReason ?? null,
          assignedToId: lead.assignedToId ?? null,
        },
        create: lead,
      })
    }

    this.logger.log('--- LEAD SEEDER COMPLETED ---')
  }
}
