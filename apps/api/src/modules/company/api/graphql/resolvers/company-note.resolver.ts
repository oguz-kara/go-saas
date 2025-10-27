// src/modules/company-note/api/graphql/resolvers/company-note.resolver.ts
import { Resolver, Mutation, Args, ID, Query } from '@nestjs/graphql'
import { CompanyNoteEntity } from 'src/modules/company/api/graphql/entities/company-note.entity' // Adjust path
import { RequestContext } from 'src/common/request-context/request-context'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { CompanyNoteService } from 'src/modules/company/application/services/company-note.service'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { AddCompanyNoteInput } from '../dto/add-company-note.input'
import { UpdateCompanyNoteInput } from '../dto/update-company-note.input'
import { CompanyConnectionNotesObject } from '../dto/company-connection-notes.object-type'
import { ListQueryArgs } from 'src/common'

@Resolver(() => CompanyNoteEntity)
@ProtectResource() // All note operations require authentication
export class CompanyNoteResolver {
  constructor(private readonly companyNoteService: CompanyNoteService) {}

  @Mutation(() => CompanyNoteEntity, { name: 'addNoteToCompany' })
  async addNoteToCompany(
    @Ctx() ctx: RequestContext,
    @Args('companyId', { type: () => ID }) companyId: string,
    @Args('addCompanyNoteInput') addCompanyNoteInput: AddCompanyNoteInput,
  ): Promise<CompanyNoteEntity> {
    return this.companyNoteService.addNoteToCompany(
      ctx,
      companyId,
      addCompanyNoteInput,
    )
  }

  @Mutation(() => CompanyNoteEntity, { name: 'updateCompanyNote' })
  async updateCompanyNote(
    @Ctx() ctx: RequestContext,
    @Args('noteId', { type: () => ID }) noteId: string,
    @Args('updateCompanyNoteInput')
    updateCompanyNoteInput: UpdateCompanyNoteInput,
  ): Promise<CompanyNoteEntity> {
    return this.companyNoteService.updateCompanyNote(
      ctx,
      noteId,
      updateCompanyNoteInput,
    )
  }

  @Query(() => CompanyConnectionNotesObject, {
    name: 'companyNotes',
    nullable: true,
  })
  async getCompanyNotes(
    @Ctx() ctx: RequestContext,
    @Args('companyId', { type: () => ID }) companyId: string,
    @Args() listQueryArgs: ListQueryArgs,
  ): Promise<CompanyConnectionNotesObject> {
    return this.companyNoteService.getNotesForCompany(
      ctx,
      companyId,
      listQueryArgs,
    )
  }

  @Mutation(() => CompanyNoteEntity, { name: 'deleteCompanyNote' }) // Or return a success boolean
  async deleteCompanyNote(
    @Ctx() ctx: RequestContext,
    @Args('noteId', { type: () => ID }) noteId: string,
  ): Promise<CompanyNoteEntity> {
    return this.companyNoteService.deleteCompanyNote(ctx, noteId)
  }
}
