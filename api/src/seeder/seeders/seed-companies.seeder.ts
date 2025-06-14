// src/seeders/services/seed-companies.seeder.ts
import { Injectable, Logger } from '@nestjs/common'
import { Command } from 'nestjs-command'
import { PrismaService } from 'src/common'
import { companiesToSeed } from '../data/company.seed-data'

@Injectable()
export class SeedCompaniesSeeder {
  private readonly logger = new Logger(SeedCompaniesSeeder.name)

  constructor(private readonly prisma: PrismaService) {}

  @Command({
    command: 'seed:companies',
    describe: 'Seeds the database with initial company records',
  })
  async seedInitialCompanies(): Promise<void> {
    this.logger.log('--- STARTING COMPANY SEEDER ---')

    const existingCompanies = await this.prisma.company.findMany({
      where: {
        OR: companiesToSeed.map((company) => ({
          name: company.name,
          channelToken: company.channelToken,
        })),
      },
      select: { name: true, channelToken: true },
    })

    const newCompaniesToCreate = companiesToSeed.filter(
      (seedCompany) =>
        !existingCompanies.some(
          (dbCompany) =>
            dbCompany.name === seedCompany.name &&
            dbCompany.channelToken === seedCompany.channelToken,
        ),
    )

    if (newCompaniesToCreate.length === 0) {
      this.logger.log('All seed companies already exist.')
      this.logger.log('--- COMPANY SEEDER COMPLETED ---')
      return
    }

    this.logger.log(
      `Found ${newCompaniesToCreate.length} new company/companies to seed.`,
    )

    const createdCompanies = await this.prisma.company.createMany({
      data: newCompaniesToCreate,
      skipDuplicates: true,
    })
    this.logger.log(
      `Successfully seeded ${createdCompanies.count} new company/companies.`,
    )

    this.logger.log('--- COMPANY SEEDER COMPLETED ---')
  }

  @Command({
    command: 'delete:initial-companies',
    describe: 'Deletes the database with initial companies',
  })
  async deleteInitialCompanies(): Promise<void> {
    await this.prisma.company.deleteMany({
      where: {
        name: { in: companiesToSeed.map((company) => company.name) },
      },
    })
  }
}
