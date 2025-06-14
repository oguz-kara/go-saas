import { NotFoundException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class AttributeTypeNotFoundError extends NotFoundException {
  constructor(attributeTypeId: string) {
    super(`Attribute type with ID "${attributeTypeId}" not found.`)
    this.name = exceptionCodes.ATTRIBUTE_TYPE_NOT_FOUND_EXCEPTION
  }
} 