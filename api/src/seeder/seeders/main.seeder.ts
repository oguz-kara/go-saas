// src/seeders/services/main.seeder.ts
import { Injectable, Logger } from '@nestjs/common'
import { SeedUsersSeeder } from './seed-users.seeder'
import { SeedCompaniesSeeder } from './seed-companies.seeder'
import { SeedChannelSeeder } from './seed-channel.seeder'
import { Command } from 'nestjs-command'

@Injectable()
export class MainSeeder {
  private readonly logger = new Logger(MainSeeder.name)

  constructor(
    private readonly usersSeeder: SeedUsersSeeder,
    private readonly companiesSeeder: SeedCompaniesSeeder,
    private readonly channelSeeder: SeedChannelSeeder,
  ) {}

  @Command({
    command: 'seed:all',
    describe:
      'Seeds the database with initial all like users, companies, channels, etc.',
  })
  async runAll() {
    this.logger.log('--- STARTING ALL SEEDERS ---')

    await this.channelSeeder.seedInitialChannels()
    await this.usersSeeder.seedInitialUsers()
    await this.companiesSeeder.seedInitialCompanies()

    this.logger.log('--- ALL SEEDERS COMPLETED ---')
  }
}
