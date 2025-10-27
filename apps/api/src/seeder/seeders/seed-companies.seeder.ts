// src/seeders/services/seed-companies.seeder.ts
import { Injectable, Logger } from '@nestjs/common'
import { Command } from 'nestjs-command'
import { PrismaService } from 'src/common'
import { companiesToSeed } from '../data/company.seed-data'
import { AttributableType } from '@prisma/client'

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
        deletedAt: null,
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
      data: newCompaniesToCreate.map((nc) => ({
        name: nc.name,
        channelToken: nc.channelToken,
        website: nc.website,
        description: nc.description,
        linkedinUrl: nc.linkedinUrl,
        address: nc.address,
        taxId: nc.taxId,
        email: nc.email,
        phoneNumber: nc.phoneNumber,
        socialProfiles: nc.socialProfiles,
      })),
      skipDuplicates: true,
    })
    this.logger.log(
      `Successfully seeded ${createdCompanies.count} new company/companies.`,
    )

    // After creating companies
    for (const company of newCompaniesToCreate) {
      if (company.attributeValues) {
        // Find the created company by name+channelToken (not unique, but sufficient for seed)
        const createdCompanies = await this.prisma.company.findMany({
          where: {
            name: company.name,
            channelToken: company.channelToken || undefined,
          },
          select: { id: true },
        })
        const createdCompany = createdCompanies[0]
        if (!createdCompany) {
          this.logger.warn(`Company not found after creation: ${company.name}`)
          continue
        }

        for (const [attributeTypeCode, attributeValueCode] of Object.entries(
          company.attributeValues,
        )) {
          // Find the attribute value by code and type
          const attributeValue = await this.prisma.attributeValue.findFirst({
            where: {
              code: attributeValueCode,
              type: { code: attributeTypeCode },
              channelToken: company.channelToken || undefined,
            },
            select: { id: true },
          })

          if (attributeValue) {
            await this.prisma.attributeAssignment.create({
              data: {
                attributableId: createdCompany.id,
                attributableType: AttributableType.COMPANY,
                attributeValueId: attributeValue.id,
                channelToken: company.channelToken as string,
              },
            })
          } else {
            this.logger.warn(
              `Attribute value not found: type=${attributeTypeCode}, code=${attributeValueCode}`,
            )
          }
        }
      }
    }

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
