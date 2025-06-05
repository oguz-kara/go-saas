import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { CompanyService } from 'src/modules/company/application/services/company.service'
import { CompanyEntity } from 'src/modules/company/api/graphql/entities/company.entity'
import { CreateCompanyInput } from 'src/modules/company/api/graphql/dto/create-company.input'
import { UpdateCompanyInput } from 'src/modules/company/api/graphql/dto/update-company.input'
import { CompaniesFilterArgs } from 'src/modules/company/api/graphql/dto/companies-filter.args'
import { CompanyConnectionObject as CompanyConnection } from 'src/modules/company/api/graphql/dto/company-connection.object-type'

import { RequestContext } from 'src/common/request-context/request-context'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { PaginationArgs } from 'src/common'
import { CompanyConnectionNotesObject } from '../dto/company-connection-notes.object-type'
import { CompanyNoteService } from 'src/modules/company/application/services/company-note.service'

@Resolver(() => CompanyEntity)
@ProtectResource()
export class CompanyResolver {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyNoteService: CompanyNoteService,
  ) {}

  @Mutation(() => CompanyEntity, { name: 'createCompany' })
  async createCompany(
    @Ctx() ctx: RequestContext,
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ): Promise<CompanyEntity> {
    return this.companyService.createCompany(ctx, createCompanyInput)
  }

  @Query(() => CompanyConnection, { name: 'companies' })
  async getCompanies(
    @Ctx() ctx: RequestContext,
    @Args() companiesFilterArgs: CompaniesFilterArgs,
  ): Promise<CompanyConnection> {
    return this.companyService.getCompanies(ctx, companiesFilterArgs)
  }

  @Query(() => CompanyEntity, { name: 'company', nullable: true })
  async getCompanyById(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CompanyEntity | null> {
    return this.companyService.getCompanyById(ctx, id)
  }

  @Mutation(() => CompanyEntity, { name: 'updateCompany' })
  async updateCompany(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ): Promise<CompanyEntity> {
    return this.companyService.updateCompany(ctx, id, updateCompanyInput)
  }

  @Mutation(() => CompanyEntity, { name: 'deleteCompany' })
  async deleteCompany(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CompanyEntity> {
    return this.companyService.deleteCompany(ctx, id)
  }

  @ResolveField('notes', () => CompanyConnectionNotesObject) // Or () => [CompanyNoteEntity] if not paginated directly here
  async getNotesForCompany(
    @Parent() company: CompanyEntity,
    @Ctx() ctx: RequestContext,
    @Args() paginationArgs: PaginationArgs, // Add if notes are paginated
  ): Promise<CompanyConnectionNotesObject> {
    // Or Promise<CompanyNoteEntity[]>
    const { id: companyId } = company
    const { items: notes, totalCount } =
      await this.companyNoteService.getNotesForCompany(
        ctx,
        companyId,
        paginationArgs,
      )
    return { items: notes, totalCount }
  }
}
