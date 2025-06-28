// src/seeders/services/seed-system-attributes.seeder.ts
import { Injectable, Logger } from '@nestjs/common'
import { Command } from 'nestjs-command'
import { PrismaService } from 'src/common'

import { systemSeedData } from '../data/attribute-feature.seed-data'
import slugify from 'slugify'

@Injectable()
export class SeedSystemAttributesSeeder {
  private readonly logger = new Logger(SeedSystemAttributesSeeder.name)

  constructor(private readonly prisma: PrismaService) {}

  @Command({
    command: 'seed:attributes',
    aliases: 'Seeds system-defined attributes, types, and values',
  })
  async run(): Promise<void> {
    this.logger.log('--- STARTING SYSTEM ATTRIBUTES SEEDER ---')

    for (const groupData of systemSeedData) {
      const channelToken = 'ch_main_tenant_1'

      // Grubu oluştur veya bul (upsert)
      const group = await this.prisma.attributeGroup.upsert({
        where: {
          name_channelToken: { name: groupData.group.name, channelToken },
        },
        update: {},
        create: {
          name: groupData.group.name,
          code: slugify(groupData.group.name, { lower: true, replacement: '' }),
          channelToken,
          isSystemDefined: true,
        },
      })

      for (const typeData of groupData.types) {
        // Tipi oluştur veya bul (upsert)
        const attributeType = await this.prisma.attributeType.upsert({
          where: {
            name_channelToken: { name: typeData.typeData.name, channelToken },
          },
          update: {},
          create: {
            name: typeData.typeData.name,
            code: slugify(typeData.typeData.name, {
              lower: true,
              replacement: '',
            }),
            dataType: typeData.typeData.dataType,
            kind: typeData.typeData.kind,
            channelToken,
            groupId: group.id,
            isSystemDefined: true,
            availableFor: {
              create: typeData.availableFor.map((entityType) => ({
                entityType,
              })),
            },
          },
        })

        // Değerleri ve hiyerarşiyi oluştur
        await this.seedValuesRecursive(
          typeData.values,
          attributeType.id,
          channelToken,
          undefined,
        )
      }
    }
    this.logger.log('--- SYSTEM ATTRIBUTES SEEDER COMPLETED ---')
  }

  @Command({
    command: 'update:attribute-group-orders',
    aliases: 'Updates attribute group orders',
  })
  async updateAttributeGroupOrders() {
    const attributeGroups = systemSeedData.map((group) => group.group)
    const attributeGroupsFromDb = await this.prisma.attributeGroup.findMany({
      where: {
        name: { in: attributeGroups.map((group) => group.name) },
      },
    })

    for (const group of attributeGroups) {
      const groupFromDb = attributeGroupsFromDb.find(
        (g) => g.name === group.name,
      )

      if (groupFromDb) {
        await this.prisma.attributeGroup.update({
          where: { id: groupFromDb.id },
          data: { order: group.order },
        })
      }
    }

    this.logger.log('--- ATTRIBUTE GROUP ORDERS UPDATED ---')
  }

  private async seedValuesRecursive(
    values: any[],
    typeId: string,
    channelToken: string,
    parentId: string | undefined,
  ) {
    for (const val of values) {
      try {
        const valueRecord = await this.prisma.attributeValue.create({
          data: {
            value: val.value,
            code: slugify(val.value, { lower: true, replacement: '' }),
            attributeTypeId: typeId,
            channelToken,
            parentId,
          },
        })

        if (val.children && val.children.length > 0) {
          await this.seedValuesRecursive(
            val.children,
            typeId,
            channelToken,
            valueRecord.id,
          )
        }
      } catch (error) {
        this.logger.error(
          `Error upserting value: ${val.value} (typeId: ${typeId}, parentId: ${parentId ?? 'none'})\n${error}`,
        )
        throw error
      }
    }
  }

  @Command({
    command: 'delete:initial-system-attributes',
    describe: 'Deletes the database with initial system attributes',
  })
  async deleteInitialSystemAttributes(): Promise<void> {
    this.logger.log('Starting deletion of initial system attributes...')

    await this.prisma.attributeType.deleteMany({
      where: { isSystemDefined: true },
    })
    await this.prisma.attributeGroup.deleteMany({
      where: { isSystemDefined: true },
    })

    this.logger.log('Successfully deleted initial system attributes')
  }
}
