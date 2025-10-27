import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { LeadEntity } from '../entities/lead.entity'
import { ActivityEntity } from '../entities/activity.entity'
import { NoteEntity } from '../entities/note.entity'
import { ListQueryArgs } from 'src/common'
import { PrismaService } from 'src/common'

@Resolver(() => LeadEntity)
export class LeadRelationsResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField('activities', () => [ActivityEntity])
  async activities(
    @Parent() lead: LeadEntity,
    @Args() args: ListQueryArgs,
  ): Promise<ActivityEntity[]> {
    const { id } = lead
    const { skip = 0, take = 10 } = args
    const items = await this.prisma.activity.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    })
    return items as unknown as ActivityEntity[]
  }

  @ResolveField('notes', () => [NoteEntity])
  async notes(
    @Parent() lead: LeadEntity,
    @Args() args: ListQueryArgs,
  ): Promise<NoteEntity[]> {
    const { id } = lead
    const { skip = 0, take = 10 } = args
    const items = await this.prisma.note.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    })
    return items as unknown as NoteEntity[]
  }
}
