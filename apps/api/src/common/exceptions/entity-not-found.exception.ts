import { NotFoundException } from '@nestjs/common'
import { exceptionCodes } from './exceptions.enum'

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, id?: string | number) {
    const identifier = id ? `with id ${id}` : ''
    const code = exceptionCodes.ENTITY_NOT_FOUND_EXCEPTION
    super({
      message: `${entityName} ${identifier} not found.`,
      entityName,
      code,
    })
    this.name = code
  }
}
