import { ConflictException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class SystemDefinedAttributeTypeError extends ConflictException {
  constructor(attributeTypeName: string) {
    super(
      `Cannot delete attribute type "${attributeTypeName}" because it is system defined.`,
    )
    this.name = exceptionCodes.SYSTEM_DEFINED_ATTRIBUTE_TYPE_EXCEPTION
  }
}
