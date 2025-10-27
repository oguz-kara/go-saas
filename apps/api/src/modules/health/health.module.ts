import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'
import { PrismaService } from 'src/common'

@Module({
  controllers: [HealthController],
  providers: [PrismaService],
})
export class HealthModule {}
