// NestJS core
import { Module, HttpException } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { CacheModule } from '@nestjs/cache-manager'
import { GraphQLFormattedError } from 'graphql'

// Third party
import { CommandModule } from 'nestjs-command'

// Application modules
import { AuthModule } from './modules/auth/auth.module'
import { CompanyModule } from './modules/company/company.module'
import { ChannelModule } from './modules/channel/channel.module'
import { AttributeModule } from './modules/attribute/attribute.module'
import { SeederModule } from './seeder/seeder.module'

// Application config
import { appConfig } from './common/config/app.config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { LeadModule } from './modules/lead/lead.module'
import { NotificationModule } from './modules/notification/notification.module'
import { EmailModule } from './modules/email/email.module'
import { ApiKeyModule } from './modules/api-key/api-key.module'
import { HealthModule } from './modules/health/health.module'
// Removed separate Activity/Note modules; handled under Lead module

@Module({
  imports: [
    // Core modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Use in-memory cache only
        console.log('ℹ️ Using in-memory cache (Redis disabled)')
        return {
          ttl: configService.get<number>('CACHE_TTL_SECONDS', 60 * 60) * 1000,
          max: configService.get<number>('CACHE_MAX_ITEMS', 500),
        }
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      debug: true,
      driver: ApolloDriver,
      path: '/admin-api',
      playground: true,
      autoSchemaFile: true,
      sortSchema: true,
      include: [
        AuthModule,
        CompanyModule,
        ChannelModule,
        AttributeModule,
        LeadModule,
        NotificationModule,
        ApiKeyModule,
      ],
      formatError: (
        formattedError: GraphQLFormattedError,
        error: any,
      ): GraphQLFormattedError => {
        const originalError = error?.originalError || error

        // If it's one of our custom, controlled exceptions (duck-typing)
        if (
          originalError &&
          typeof originalError === 'object' &&
          'getResponse' in originalError &&
          'getStatus' in originalError
        ) {
          const httpException = originalError as HttpException
          const response = httpException.getResponse()
          const status = httpException.getStatus()

          if (typeof response === 'object' && response !== null) {
            const responseObj = response as Record<string, any>
            // The response object from our exceptions is what we want in extensions.
            // It already contains 'message', 'code', 'entityName', etc.
            return {
              message: responseObj.message || formattedError.message,
              locations: formattedError.locations,
              path: formattedError.path,
              code: responseObj.code,
              extensions: {
                ...formattedError.extensions, // Keep original extensions
                ...responseObj, // Spread all our custom fields
                statusCode: status,
              },
            } as GraphQLFormattedError
          }
        }

        // For other generic GraphQL errors or unexpected server errors
        return {
          message: formattedError.message,
          locations: formattedError.locations,
          path: formattedError.path,
          extensions: {
            ...formattedError.extensions,
            code: originalError?.name || 'INTERNAL_SERVER_ERROR',
            statusCode: originalError?.statusCode || 500,
          },
        }
      },
    }),

    // Feature modules
    AuthModule,
    CompanyModule,
    ChannelModule,
    AttributeModule,
    LeadModule,
    NotificationModule,
    EmailModule,
    ApiKeyModule,
    HealthModule,

    // Utility modules
    SeederModule,
    CommandModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
