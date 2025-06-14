import { Prisma } from '@prisma/client'

export const mainChannelToken = 'ch_main_tenant_1'

export const channelsToSeed: Prisma.ChannelCreateManyInput[] = [
  {
    token: mainChannelToken,
    name: 'Main Tenant',
    description: 'Main Tenant',
  },
]
