import { ConflictException } from '@nestjs/common'
import { exceptionCodes } from './exceptions.enum'

export class UniqueConstraintViolationException extends ConflictException {
  constructor(fields: string | string[]) {
    const fieldString = Array.isArray(fields) ? fields.join(', ') : fields
    const code = exceptionCodes.UNIQUE_CONSTRAINT_VIOLATION_EXCEPTION
    super({
      message: `A resource with the same value for '${fieldString}' already exists.`,
      fields: Array.isArray(fields) ? fields : [fields],
      code,
    })
    this.name = code
  }
}
