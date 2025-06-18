import { ForbiddenException } from '@nestjs/common'
import { exceptionCodes } from './exceptions.enum'

export class SystemDefinedEntityException extends ForbiddenException {
  constructor(entityName: string, operation: 'modify' | 'delete') {
    const code = exceptionCodes.SYSTEM_DEFINED_ENTITY_EXCEPTION
    super({
      message: `Cannot ${operation} the system-defined ${entityName}.`,
      entityName,
      operation,
      code,
    })
    this.name = code
  }
}
