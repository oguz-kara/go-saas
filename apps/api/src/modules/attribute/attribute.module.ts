import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { AttributeService } from './application/services/attribute.service'
import { AttributeResolver } from './api/graphql/resolvers/attribute.resolver'
import { AttributeTypeResolver } from './api/graphql/resolvers/attribute-type.resolver'
import { AttributeTypeService } from './application/services/attribute-type.service'
import { AttributeGroupResolver } from './api/graphql/resolvers/attribute-group.resolver'
import { AttributeGroupService } from './application/services/attribute-group.service'

@Module({
  providers: [
    PrismaService,
    AttributeService,
    AttributeTypeService,
    AttributeGroupService,
    AttributeResolver,
    AttributeTypeResolver,
    AttributeGroupResolver,
  ],
  exports: [AttributeService, AttributeTypeService, AttributeGroupService],
})
export class AttributeModule {}
