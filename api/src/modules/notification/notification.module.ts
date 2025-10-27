import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NotificationResolver } from './api/graphql/resolvers/notification.resolver'
import { NotificationService } from './application/services/notification.service'
import { NotificationGateway } from './api/gateway/notification.gateway'
import { PrismaService } from 'src/common'
import { OnLeadCreatedHandler } from './application/events/on-lead-created.handler'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    NotificationResolver,
    NotificationService,
    NotificationGateway,
    PrismaService,
    OnLeadCreatedHandler,
  ],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}


