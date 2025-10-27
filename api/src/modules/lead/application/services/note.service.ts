import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService, RequestContext } from 'src/common'
import { NoteEntity } from '../../api/graphql/entities/note.entity'
import { CreateActivityInput } from '../../api/graphql/dto/create-activity.input'
import { ActivityEntity } from '../../api/graphql/entities/activity.entity'
import { UpdateActivityInput } from '../../api/graphql/dto/update-activity.input'
import { ActivitiesFilterArgs } from '../../api/graphql/args/activities-filter.args'

@Injectable()
export class NoteService {
  private readonly logger = new Logger(NoteService.name)

  constructor(private readonly prisma: PrismaService) {}

  async createNote(
    ctx: RequestContext,
    input: CreateActivityInput,
  ): Promise<NoteEntity> {
    const userId = ctx.user?.id
    if (!userId) throw new InternalServerErrorException('User context invalid')

    const created = await this.prisma.note.create({
      data: {
        content: input.description ?? '',
        leadId: input.leadId,
        userId,
      },
    })
    return created as unknown as NoteEntity
  }

  async updateNote(
    ctx: RequestContext,
    input: UpdateActivityInput,
  ): Promise<NoteEntity> {
    try {
      const updated = await this.prisma.note.update({
        where: { id: input.id },
        data: { content: input.description ?? undefined },
      })
      return updated as unknown as NoteEntity
    } catch (error) {
      if (error?.code === 'P2025') throw new NotFoundException('Note not found')
      throw new InternalServerErrorException('Could not update note')
    }
  }

  async deleteNote(ctx: RequestContext, id: string): Promise<NoteEntity> {
    try {
      const deleted = await this.prisma.note.delete({ where: { id } })
      return deleted as unknown as NoteEntity
    } catch (error) {
      if (error?.code === 'P2025') throw new NotFoundException('Note not found')
      throw new InternalServerErrorException('Could not delete note')
    }
  }

  async getNoteById(
    ctx: RequestContext,
    id: string,
  ): Promise<NoteEntity | null> {
    const note = await this.prisma.note.findUnique({ where: { id } })
    return (note as unknown as NoteEntity) ?? null
  }

  async getNotes(
    ctx: RequestContext,
    args: ActivitiesFilterArgs,
  ): Promise<{ items: ActivityEntity[]; totalCount: number }> {
    const where: any = {}
    if (args.leadId) where.leadId = args.leadId
    if (args.userId) where.userId = args.userId
    if (args.searchQuery)
      where.content = { contains: args.searchQuery, mode: 'insensitive' }

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.note.findMany({
        where,
        skip: args.skip ?? 0,
        take: args.take ?? 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.note.count({ where }),
    ])

    return { items: items as unknown as ActivityEntity[], totalCount }
  }
}
