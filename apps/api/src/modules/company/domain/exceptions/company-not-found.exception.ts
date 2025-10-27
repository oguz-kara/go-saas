// src/modules/company/domain/exceptions/company-not-found.exception.ts
import { NotFoundException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class CompanyNotFoundError extends NotFoundException {
  constructor(companyId: string) {
    super(`Company with ID "${companyId}" not found.`)
    this.name = exceptionCodes.COMPANY_NOT_FOUND_EXCEPTION
  }
}
