import { ConflictException } from '@nestjs/common'
import { exceptionCodes } from './exceptions.enum'

export class CannotDeleteParentEntityException extends ConflictException {
  constructor(parentEntity: string, childEntity: string) {
    const code = exceptionCodes.CANNOT_DELETE_PARENT_ENTITY_EXCEPTION
    super({
      message: `Cannot delete ${parentEntity} because it has associated ${childEntity}.`,
      parentEntity,
      childEntity,
      code,
    })
    this.name = code
  }
}
