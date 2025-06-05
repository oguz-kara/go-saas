import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth'
import { CompanyModule } from './modules/company'
import { ChannelModule } from './modules/channel'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { appConfig } from './common/config/app.config'
import { redisStore } from 'cache-manager-redis-yet'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    AuthModule,
    CompanyModule,
    ChannelModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
          },
          password: configService.get<string>('REDIS_PASSWORD'),
          ttl: configService.get<number>('CACHE_TTL_SECONDS', 60 * 60),
        })
        return {
          store,
        }
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      debug: true,
      driver: ApolloDriver,
      path: '/admin-api',
      playground: true,
      autoSchemaFile: 'schema.graphql',
      sortSchema: true,
      include: [AuthModule, CompanyModule, ChannelModule],
      formatError: (formattedError, error: any) => {
        const originalError = formattedError.extensions?.originalError as any
        const defaultMessage =
          originalError?.defaultMessage || formattedError.message

        return {
          message: defaultMessage,
          code: error?.originalError?.name || 'GENERIC_GRAPHQL_ERROR',
          statusCode: originalError?.statusCode || 500,
          path: formattedError.path,
        }
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
