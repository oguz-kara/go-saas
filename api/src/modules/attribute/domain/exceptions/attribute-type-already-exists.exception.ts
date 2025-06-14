import { ConflictException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class AttributeTypeAlreadyExistsError extends ConflictException {
  constructor(attributeTypeName: string) {
    super(`Attribute type with name "${attributeTypeName}" already exists in this channel.`)
    this.name = exceptionCodes.ATTRIBUTE_TYPE_ALREADY_EXISTS_EXCEPTION
  }
} 