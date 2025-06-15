import { Module } from '@nestjs/common'
import { CompanyService } from './application/services/company.service'
import {
  AttributeWithTypeResolver,
  CompanyResolver,
} from './api/graphql/resolvers/company.resolver'
import { PrismaService } from 'src/common'
import { CompanyNoteService } from './application/services/company-note.service'
import { CompanyNoteResolver } from './api/graphql/resolvers/company-note.resolver'
import { AttributeModule } from '../attribute'

@Module({
  imports: [AttributeModule],
  providers: [
    CompanyService,
    PrismaService,
    CompanyNoteService,
    CompanyNoteResolver,
    CompanyResolver,
    AttributeWithTypeResolver,
  ],
  exports: [CompanyService, CompanyNoteService],
})
export class CompanyModule {}
