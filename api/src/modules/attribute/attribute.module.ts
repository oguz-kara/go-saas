import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { AttributeService } from './application/services/attribute.service'
import { AttributeResolver } from './api/graphql/resolvers/attribute.resolver'
import { AttributeTypeResolver } from './api/graphql/resolvers/attribute-type.resolver'
import { AttributeTypeService } from './application/services/attribute-type.service'
import { AttributeWithTypeResolver } from './api/graphql/resolvers/attribute.resolver'

@Module({
  imports: [],
  providers: [
    PrismaService,
    AttributeService,
    AttributeTypeService,
    AttributeResolver,
    AttributeTypeResolver,
    AttributeWithTypeResolver,
  ],
  exports: [AttributeService, AttributeTypeService, AttributeWithTypeResolver],
})
export class AttributeModule {}
