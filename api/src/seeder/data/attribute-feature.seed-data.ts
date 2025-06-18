import {
  AttributableType,
  AttributeDataType,
  AttributeTypeKind,
} from '@prisma/client'

export const systemSeedData = [
  {
    group: { name: 'Genel Bilgiler', order: 1 },
    types: [
      {
        typeData: {
          name: 'Müşteri Durumu',
          kind: AttributeTypeKind.SELECT,
          dataType: AttributeDataType.TEXT,
        },
        availableFor: [AttributableType.COMPANY],
        values: [
          { value: 'Potansiyel Müşteri' },
          { value: 'Teklif Aşamasında' },
          { value: 'Mevcut Müşteri' },
          { value: 'Pasif Müşteri' },
          { value: 'Dondurulmuş Müşteri' },
        ],
      },
      {
        typeData: {
          name: 'Sektör',
          kind: AttributeTypeKind.MULTI_SELECT,
          dataType: AttributeDataType.TEXT,
        },
        availableFor: [AttributableType.COMPANY],
        values: [
          { value: 'Yazılım' },
          { value: 'Teknoloji' },
          { value: 'Finans' },
          { value: 'Lojistik' },
          { value: 'Sağlık' },
          { value: 'Eğitim' },
          { value: 'Perakende' },
          { value: 'Enerji' },
        ],
      },
      {
        typeData: {
          name: 'Şirket Büyüklüğü',
          kind: AttributeTypeKind.SELECT,
          dataType: AttributeDataType.TEXT,
        },
        availableFor: [AttributableType.COMPANY],
        values: [
          { value: '1-10 Çalışan' },
          { value: '11-50 Çalışan' },
          { value: '51-200 Çalışan' },
          { value: '200+ Çalışan' },
          { value: '1000+ Çalışan' },
        ],
      },
      {
        typeData: {
          name: 'Kuruluş Yılı',
          kind: AttributeTypeKind.SELECT,
          dataType: AttributeDataType.NUMBER,
        },
        availableFor: [AttributableType.COMPANY],
        values: [
          { value: '1990' },
          { value: '2000' },
          { value: '2010' },
          { value: '2020' },
        ],
      },
      {
        typeData: {
          name: 'Çalışma Şekli',
          kind: AttributeTypeKind.SELECT,
          dataType: AttributeDataType.TEXT,
        },
        availableFor: [AttributableType.COMPANY],
        values: [{ value: 'Uzaktan' }, { value: 'Ofis' }, { value: 'Hibrit' }],
      },
    ],
  },
  {
    group: { name: 'Finansal Bilgiler', order: 4 },
    types: [
      {
        typeData: {
          name: 'Yıllık Ciro',
          kind: AttributeTypeKind.SELECT,
          dataType: AttributeDataType.NUMBER,
        },
        availableFor: [AttributableType.COMPANY],
        values: [
          { value: '0-1M TL' },
          { value: '1-10M TL' },
          { value: '10-100M TL' },
          { value: '100M+ TL' },
        ],
      },
    ],
  },
  {
    group: { name: 'Adres Bilgileri', order: 2 },
    types: [
      {
        typeData: {
          name: 'Adres bilgileri',
          kind: AttributeTypeKind.HIERARCHICAL,
          dataType: AttributeDataType.TEXT,
        },
        availableFor: [AttributableType.COMPANY],
        values: [
          {
            id: 'tr',
            value: 'Türkiye',
            children: [
              {
                id: 'ankara',
                value: 'Ankara',
                children: [
                  { id: 'cankaya', value: 'Çankaya' },
                  { id: 'kecioren', value: 'Keçiören' },
                ],
              },
              {
                id: 'izmir',
                value: 'İzmir',
                children: [
                  { id: 'bornova', value: 'Bornova' },
                  { id: 'karşıyaka', value: 'Karşıyaka' },
                ],
              },
              {
                id: 'istanbul',
                value: 'İstanbul',
                children: [
                  { id: 'kadikoy', value: 'Kadıköy' },
                  { id: 'besiktas', value: 'Beşiktaş' },
                  { id: 'sisli', value: 'Şişli' },
                ],
              },
            ],
          },
          {
            id: 'ro',
            value: 'Romania',
            children: [
              {
                id: 'bucuresti',
                value: 'București',
                children: [
                  { id: 'bucuresti-dorobanti', value: 'Dorobanți' },
                  { id: 'bucuresti-floreasca', value: 'Floreasca' },
                  { id: 'bucuresti-aviatiei', value: 'Aviației' },
                  { id: 'bucuresti-pipera', value: 'Pipera' },
                  { id: 'bucuresti-herastrau', value: 'Herăstrău' },
                  { id: 'bucuresti-primavarii', value: 'Primăverii' },
                ],
              },
              {
                id: 'cluj',
                value: 'Cluj-Napoca',
                children: [
                  { id: 'centru', value: 'Centru' },
                  { id: 'manastur', value: 'Mănăștur' },
                  { id: 'grigorescu', value: 'Grigorescu' },
                ],
              },
            ],
          },
          {
            id: 'bg',
            value: 'Bulgaria',
            children: [
              {
                id: 'sofia',
                value: 'Sofia',
                children: [
                  { id: 'lozenets', value: 'Lozenets' },
                  { id: 'mladost', value: 'Mladost' },
                  { id: 'vitosha', value: 'Vitosha' },
                ],
              },
              {
                id: 'plovdiv',
                value: 'Plovdiv',
                children: [
                  { id: 'tsentralen', value: 'Tsentralen' },
                  { id: 'trakija', value: 'Trakiya' },
                  { id: 'kapana', value: 'Kapana' },
                ],
              },
            ],
          },
          {
            id: 'de',
            value: 'Almanya',
            children: [
              {
                id: 'berlin',
                value: 'Berlin',
                children: [
                  { id: 'mitte', value: 'Mitte' },
                  { id: 'kreuzberg', value: 'Kreuzberg' },
                ],
              },
              {
                id: 'munich',
                value: 'Münih',
                children: [
                  { id: 'schwabing', value: 'Schwabing' },
                  { id: 'maxvorstadt', value: 'Maxvorstadt' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
