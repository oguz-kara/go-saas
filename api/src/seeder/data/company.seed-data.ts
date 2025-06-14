import { Prisma } from '@prisma/client'
import { mainChannelToken } from './channel.seed-data'

export const companiesToSeed: Prisma.CompanyCreateManyInput[] = [
  {
    name: 'Gocr Bilişim Teknolojileri',
    industry: 'Yazılım ve Teknoloji',
    website: 'https://gocr.dev',
    description: 'Bulut tabanlı modern CRM ve iş yönetimi çözümleri sunar.',
    channelToken: mainChannelToken,
  },
  {
    name: 'İzmir Lojistik A.Ş.',
    industry: 'Lojistik ve Taşımacılık',
    website: 'https://izmirlojistik.com.tr',
    description: 'Ege bölgesi odaklı lojistik hizmetleri.',
    channelToken: mainChannelToken,
  },
]
