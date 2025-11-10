import { Module } from '@nestjs/common'
import { LeadResolver } from './api/graphql/resolvers/lead.resolver'
import { LeadService } from './application/services/lead.service'
import { PrismaService } from 'src/common'
import { LeadRelationsResolver } from './api/graphql/resolvers/lead.relations.resolver'
import { LeadActivityResolver } from './api/graphql/resolvers/activity.resolver'
import { LeadNoteResolver } from './api/graphql/resolvers/lead.note.resolver'
import { ActivityService } from './application/services/activity.service'
import { NoteService } from './application/services/note.service'
import { ApiKeyModule } from '../api-key/api-key.module'
import { CacheModule } from 'src/common/services/cache/cache.module'

@Module({
  imports: [ApiKeyModule, CacheModule],
  controllers: [],
  providers: [
    LeadResolver,
    LeadRelationsResolver,
    LeadActivityResolver,
    LeadNoteResolver,
    LeadService,
    PrismaService,
    ActivityService,
    NoteService,
  ],
  exports: [LeadService, ActivityService, NoteService],
})
export class LeadModule {}
