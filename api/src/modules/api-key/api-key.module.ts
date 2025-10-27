import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { ApiKeyService } from './application/services/api-key.service'
import { ApiKeyResolver } from './api/graphql/resolvers/api-key.resolver'
import { CacheModule } from 'src/common/services/cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [PrismaService, ApiKeyService, ApiKeyResolver],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
