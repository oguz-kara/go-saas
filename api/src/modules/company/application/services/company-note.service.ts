// src/modules/company-note/application/services/company-note.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CompanyNoteEntity } from 'src/modules/company/api/graphql/entities/company-note.entity'

import { CompanyNoteType, Prisma } from '@prisma/client'
import { AddCompanyNoteInput } from '../../api/graphql/dto/add-company-note.input'
import { UpdateCompanyNoteInput } from '../../api/graphql/dto/update-company-note.input'
import { EntityNotFoundException } from 'src/common/exceptions'

@Injectable()
export class CompanyNoteService {
  private readonly logger = new Logger(CompanyNoteService.name)

  constructor(private readonly prisma: PrismaService) {}

  async addNoteToCompany(
    ctx: RequestContext,
    companyId: string,
    input: AddCompanyNoteInput,
    channelToken?: string,
  ): Promise<CompanyNoteEntity> {
    const { user, channel } = ctx

    console.log('user', user)

    const ct = channelToken ? channelToken : channel.token

    const userId = user?.id
    if (!userId) {
      this.logger.error(
        'User ID missing from context while adding note.',
        undefined,
        'addNoteToCompany',
      )
      throw new InternalServerErrorException('User context is invalid.')
    }

    this.logger.log(
      `User ${userId} adding note to company ${companyId}`,
      'addNoteToCompany',
    )

    try {
      // Ensure company exists (and is not soft-deleted)
      const company = await this.prisma.company.findFirst({
        where: { id: companyId, deletedAt: null, channelToken: ct },
      })
      if (!company) {
        throw new EntityNotFoundException('Company', companyId)
      }

      const newNote = await this.prisma.companyNote.create({
        data: {
          content: input.content,
          type: input.type as CompanyNoteType,
          channelToken: ct as string,
          companyId,
          userId,
        },
      })
      return newNote as CompanyNoteEntity
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error
      this.logger.error(
        `Failed to add note for company ${companyId} by user ${userId}: ${error.message}`,
        error.stack,
        'addNoteToCompany',
      )
      throw new InternalServerErrorException('Could not add note to company.')
    }
  }

  async getNotesForCompany(
    ctx: RequestContext,
    companyId: string,
    args: {
      skip?: number
      take?: number
      searchQuery?: string
      channelToken?: string
    },
  ): Promise<{ items: CompanyNoteEntity[]; totalCount: number }> {
    const { user, channel } = ctx
    const { skip = 0, take = 10, searchQuery, channelToken } = args

    const ct = channelToken ? channelToken : channel.token

    this.logger.log(
      `User ${user?.id || 'System'} fetching notes for company ${companyId}`,
      'getNotesForCompany',
    )

    const whereClause: Prisma.CompanyNoteWhereInput = {
      userId: user?.id,
    }

    if (ct) {
      whereClause.channelToken = ct
    }

    if (searchQuery) {
      whereClause.OR = [
        { content: { contains: searchQuery, mode: 'insensitive' } },
      ]
    }

    try {
      const company = await this.prisma.company.findFirst({
        where: { id: companyId, deletedAt: null, channelToken: ct },
      })
      if (!company) {
        throw new EntityNotFoundException('Company', companyId)
      }

      whereClause.companyId = companyId

      const [notes, totalCount] = await Promise.all([
        this.prisma.companyNote.findMany({
          where: whereClause,
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.companyNote.count({
          where: whereClause,
        }),
      ])

      return { items: notes as CompanyNoteEntity[], totalCount }
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error
      this.logger.error(
        `Failed to fetch notes for company ${companyId}: ${error.message}`,
        error.stack,
        'getNotesForCompany',
      )
      throw new InternalServerErrorException('Could not fetch notes.')
    }
  }

  async updateCompanyNote(
    ctx: RequestContext,
    noteId: string,
    input: UpdateCompanyNoteInput,
    channelToken?: string,
  ): Promise<CompanyNoteEntity> {
    const { user, channel } = ctx

    const ct = channelToken ? channelToken : channel.token
    const userId = user?.id

    if (!userId) {
      this.logger.error(
        'User ID missing from context while updating note.',
        undefined,
        'updateCompanyNote',
      )
      throw new InternalServerErrorException('User context is invalid.')
    }

    this.logger.log(
      `User ${userId} updating note ${noteId}`,
      'updateCompanyNote',
    )

    try {
      const note = await this.prisma.companyNote.findUnique({
        where: { id: noteId, channelToken: ct },
      })

      if (!note) {
        throw new EntityNotFoundException('CompanyNote', noteId)
      }

      const updatedNote = await this.prisma.companyNote.update({
        where: { id: noteId, channelToken: ct },
        data: {
          content: input.content,
          type: input.type as CompanyNoteType,
        },
      })
      return updatedNote as CompanyNoteEntity
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error
      }
      this.logger.error(
        `Failed to update note ${noteId} by user ${userId}: ${error.message}`,
        error.stack,
        'updateCompanyNote',
      )
      throw new InternalServerErrorException('Could not update note.')
    }
  }

  async deleteCompanyNote(
    ctx: RequestContext,
    noteId: string,
    channelToken?: string,
  ): Promise<CompanyNoteEntity> {
    const { user, channel } = ctx

    const ct = channelToken ? channelToken : channel.token

    const userId = user?.id
    if (!userId) {
      this.logger.error(
        'User ID missing from context while deleting note.',
        undefined,
        'deleteCompanyNote',
      )
      throw new InternalServerErrorException('User context is invalid.')
    }

    this.logger.log(
      `User ${userId} deleting note ${noteId}`,
      'deleteCompanyNote',
    )

    try {
      const note = await this.prisma.companyNote.findUnique({
        where: { id: noteId, channelToken: ct },
      })

      if (!note) {
        throw new EntityNotFoundException('CompanyNote', noteId)
      }

      const deletedNote = await this.prisma.companyNote.delete({
        where: { id: noteId, channelToken: ct },
      })
      return deletedNote as CompanyNoteEntity
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotFoundException('CompanyNote', noteId)
      }
      this.logger.error(
        `Failed to delete note ${noteId} by user ${userId}: ${error.message}`,
        error.stack,
        'deleteCompanyNote',
      )
      throw new InternalServerErrorException('Could not delete note.')
    }
  }
}
