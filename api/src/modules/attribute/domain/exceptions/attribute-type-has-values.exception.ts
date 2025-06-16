import { ConflictException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class AttributeTypeHasValuesError extends ConflictException {
  constructor(attributeTypeName: string) {
    super(
      `Cannot delete attribute type "${attributeTypeName}" because it has associated values.`,
    )
    this.name = exceptionCodes.ATTRIBUTE_TYPE_HAS_VALUES_EXCEPTION
  }
}
