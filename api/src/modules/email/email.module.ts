import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EmailService } from './application/services/email.service'
import { OnLeadCreatedEmailHandler } from './application/events/on-lead-created-email.handler'
import { PrismaService } from 'src/common'
import { emailConfig } from 'src/common/config/email.config'

@Module({
  imports: [ConfigModule.forFeature(emailConfig)],
  providers: [EmailService, OnLeadCreatedEmailHandler, PrismaService],
  exports: [EmailService],
})
export class EmailModule {}
