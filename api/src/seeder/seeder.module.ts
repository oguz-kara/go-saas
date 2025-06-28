import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { SeedUsersSeeder } from './seeders/seed-users.seeder'
import { MainSeeder } from './seeders/main.seeder'
import { SeedCompaniesSeeder } from './seeders/seed-companies.seeder'
import { SeedChannelSeeder } from './seeders/seed-channel.seeder'
import { SeedSystemAttributesSeeder } from './seeders/seed-system-attributes.seeder'
import { BuildAddressJsonSeeder } from './seeders/build-address.seeder'

@Module({
  imports: [],
  providers: [
    MainSeeder,
    PrismaService,
    SeedUsersSeeder,
    SeedCompaniesSeeder,
    SeedChannelSeeder,
    SeedSystemAttributesSeeder,
    BuildAddressJsonSeeder,
  ],
})
export class SeederModule {}
