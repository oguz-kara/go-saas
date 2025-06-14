// src/seeders/services/seed-channels.seeder.ts
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { Command } from 'nestjs-command'

const channelsToSeed = [
  {
    token: 'ch_main_tenant_1',
    name: 'Main Tenant',
    description: 'Main Tenant',
  },
]

@Injectable()
export class SeedChannelSeeder {
  private readonly logger = new Logger(SeedChannelSeeder.name)

  constructor(private readonly prisma: PrismaService) {}

  @Command({
    command: 'seed:channels',
    describe: 'Seeds the database with initial channels',
  })
  async seedInitialChannels(): Promise<void> {
    this.logger.log('Starting channel seeding process...')

    for (const channelData of channelsToSeed) {
      await this.prisma.channel.upsert({
        where: { token: channelData.token },
        update: {},
        create: channelData,
      })
      this.logger.log(`Channel "${channelData.name}" is ready.`)
    }

    try {
      const createdChannels = await this.prisma.channel.createMany({
        data: channelsToSeed.map((channel) => ({
          ...channel,
        })),
        skipDuplicates: true,
      })
      this.logger.log(
        `Successfully seeded ${createdChannels.count} new channel(s).`,
      )
    } catch (error) {
      this.logger.error(
        'An error occurred during createMany for channels.',
        error,
      )
      throw error
    }
  }

  @Command({
    command: 'delete:initial-channels',
    describe: 'Deletes the database with initial channels',
  })
  async deleteInitialChannels(): Promise<void> {
    await this.prisma.channel.deleteMany({
      where: {
        token: { in: channelsToSeed.map((channel) => channel.token) },
      },
    })
  }
}
