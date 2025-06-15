import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { AttributeService } from './application/services/attribute.service'
import { AttributeResolver } from './api/graphql/resolvers/attribute.resolver'
import { AttributeTypeResolver } from './api/graphql/resolvers/attribute-type.resolver'
import { AttributeTypeService } from './application/services/attribute-type.service'

@Module({
  providers: [
    PrismaService,
    AttributeService,
    AttributeTypeService,
    AttributeResolver,
    AttributeTypeResolver,
  ],
  exports: [AttributeService, AttributeTypeService],
})
export class AttributeModule {}
