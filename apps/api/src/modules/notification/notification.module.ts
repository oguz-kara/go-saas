import { Module } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
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
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            configService.get<number>('JWT_EXPIRES_IN') || 7 * 24 * 60 * 60,
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
