// src/seeders/services/seed-users.seeder.ts
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/common'
import * as bcrypt from 'bcryptjs'
import { Command } from 'nestjs-command'
import { channelsToSeed } from '../data/channel.seed-data'
import { usersToSeed } from '../data/user.seed-data'

@Injectable()
export class SeedUsersSeeder {
  private readonly logger = new Logger(SeedUsersSeeder.name)

  constructor(private readonly prisma: PrismaService) {}

  @Command({
    command: 'seed:users',
    describe: 'Seeds the database with initial users',
  })
  async seedInitialUsers(): Promise<void> {
    this.logger.log('Starting user and channel seeding process...')

    for (const channelData of channelsToSeed) {
      await this.prisma.channel.upsert({
        where: { token: channelData.token },
        update: {},
        create: channelData,
      })
      this.logger.log(`Channel "${channelData.name}" is ready.`)
    }

    const existingUserEmails = (
      await this.prisma.user.findMany({
        where: {
          email: {
            in: usersToSeed.map((user) => user.email),
          },
        },
        select: { email: true },
      })
    ).map((u) => u.email)

    const newUsersToCreate = usersToSeed.filter(
      (user) => !existingUserEmails.includes(user.email),
    )

    if (newUsersToCreate.length === 0) {
      this.logger.log('All seed users already exist. No new users to seed.')
      return
    }

    this.logger.log(`Found ${newUsersToCreate.length} new user(s) to seed.`)

    const newUsersWithHashedPasswords = await Promise.all(
      newUsersToCreate.map(async (user) => {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(user.password, saltRounds)
        return {
          ...user,
          password: hashedPassword,
        }
      }),
    )

    try {
      const createdUsers = await this.prisma.user.createMany({
        data: newUsersWithHashedPasswords,
        skipDuplicates: true,
      })
      this.logger.log(`Successfully seeded ${createdUsers.count} new user(s).`)
    } catch (error) {
      this.logger.error('An error occurred during createMany for users.', error)
      throw error
    }
  }

  @Command({
    command: 'delete:initial-users',
    describe: 'Deletes the database with initial users',
  })
  async deleteInitialUsers(): Promise<void> {
    await this.prisma.user.deleteMany({
      where: {
        email: { in: usersToSeed.map((user) => user.email) },
      },
    })
  }
}
