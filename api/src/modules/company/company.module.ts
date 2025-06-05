import { Module } from '@nestjs/common'
import { CompanyService } from './application/services/company.service'
import { CompanyResolver } from './api/graphql/resolvers/company.resolver'
import { PrismaService } from 'src/common'
import { CompanyNoteService } from './application/services/company-note.service'
import { CompanyNoteResolver } from './api/graphql/resolvers/company-note.resolver'

@Module({
  providers: [
    CompanyService,
    PrismaService,
    CompanyNoteService,
    CompanyNoteResolver,
    CompanyResolver,
  ],
  exports: [CompanyService, CompanyNoteService],
})
export class CompanyModule {}
