import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { SeedUsersSeeder } from './seeders/seed-users.seeder'
import { MainSeeder } from './seeders/main.seeder'
import { SeedCompaniesSeeder } from './seeders/seed-companies.seeder'
import { SeedChannelSeeder } from './seeders/seed-channel.seeder'

@Module({
  imports: [],
  providers: [
    MainSeeder,
    PrismaService,
    SeedUsersSeeder,
    SeedCompaniesSeeder,
    SeedChannelSeeder,
  ],
})
export class SeederModule {}
