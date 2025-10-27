import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { NoteEntity } from '../entities/note.entity'
import { NoteService } from '../../../application/services/note.service'
import { NoteConnectionObject } from '../entities/note-connection.object-type'

@Resolver(() => NoteEntity)
@ProtectResource()
export class LeadNoteResolver {
  constructor(private readonly service: NoteService) {}

  @Query(() => NoteEntity, { name: 'note', nullable: true })
  async note(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<NoteEntity | null> {
    return this.service.getNoteById(ctx, id)
  }

  @Query(() => NoteConnectionObject, { name: 'notes' })
  async notes(
    @Ctx() ctx: RequestContext,
    @Args('leadId', { type: () => ID, nullable: true }) leadId?: string,
    @Args('userId', { type: () => ID, nullable: true }) userId?: string,
    @Args('skip', { type: () => Number, nullable: true }) skip?: number,
    @Args('take', { type: () => Number, nullable: true }) take?: number,
    @Args('searchQuery', { type: () => String, nullable: true })
    searchQuery?: string,
  ): Promise<NoteConnectionObject> {
    const { items, totalCount } = await this.service.getNotes(ctx, {
      leadId,
      userId,
      skip,
      take,
      searchQuery,
    })
    return { items: items as unknown as NoteEntity[], totalCount }
  }

  @Query(() => Number, { name: 'notesCount' })
  async notesCount(
    @Ctx() ctx: RequestContext,
    @Args('leadId', { type: () => ID, nullable: true }) leadId?: string,
    @Args('userId', { type: () => ID, nullable: true }) userId?: string,
    @Args('searchQuery', { type: () => String, nullable: true })
    searchQuery?: string,
  ): Promise<number> {
    const { totalCount } = await this.service.getNotes(ctx, {
      leadId,
      userId,
      searchQuery,
      skip: 0,
      take: 0,
    })
    return totalCount
  }

  @Mutation(() => NoteEntity, { name: 'createNote' })
  async createNote(
    @Ctx() ctx: RequestContext,
    @Args('content', { type: () => String }) content: string,
    @Args('leadId', { type: () => ID }) leadId: string,
  ): Promise<NoteEntity> {
    return this.service.createNote(ctx, {
      description: content,
      leadId,
      scheduledAt: undefined,
      subject: '',
      type: 'NOTE',
    })
  }

  @Mutation(() => NoteEntity, { name: 'updateNote' })
  async updateNote(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
    @Args('content', { type: () => String, nullable: true }) content?: string,
  ): Promise<NoteEntity> {
    return this.service.updateNote(ctx, { id, description: content })
  }

  @Mutation(() => NoteEntity, { name: 'deleteNote' })
  async deleteNote(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<NoteEntity> {
    return this.service.deleteNote(ctx, id)
  }
}
