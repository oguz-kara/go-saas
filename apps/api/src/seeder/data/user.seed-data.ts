import { Prisma } from '@prisma/client'
import { mainChannelToken } from './channel.seed-data'

export const usersToSeed: Prisma.UserCreateManyInput[] = [
  {
    id: 'usr_root_ho',
    name: 'Hasan Oğuz',
    email: 'hasanoguz.developer@gmail.com',
    password: process.env.SEED_USER_PASSWORD || '4784961Edc!',
    channelToken: mainChannelToken,
  },
  {
    id: 'usr_root_mb',
    name: 'Mustafa Becerek',
    email: 'mustafabecerek371@gmail.com',
    password: process.env.SEED_USER_PASSWORD || '162035Mbe!',
    channelToken: mainChannelToken,
  },
  {
    id: 'usr_root_mp',
    name: 'Mert Pz',
    email: 'iys.mert.satis@gmail.com',
    password: process.env.SEED_USER_PASSWORD || '162035Mbe!',
    channelToken: mainChannelToken,
  },
]
