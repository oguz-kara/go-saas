import {
  AttributableType,
  AttributeDataType,
  AttributeTypeKind,
} from '@prisma/client'
import { locationTree } from './tr-address-tree'
import slugify from 'slugify'

function addIdToValues(values: any[]): any[] {
  return values.map((val) => {
    const id = slugify(val.value, { lower: true })
    if (val.children && Array.isArray(val.children)) {
      return {
        ...val,
        id,
        children: addIdToValues(val.children),
      }
    }
    return { ...val, id }
  })
}

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
        values: addIdToValues([
          { value: 'Potansiyel Müşteri' },
          { value: 'Teklif Aşamasında' },
          { value: 'Mevcut Müşteri' },
          { value: 'Pasif Müşteri' },
          { value: 'Dondurulmuş Müşteri' },
        ]),
      },
      {
        typeData: {
          name: 'Sektör',
          kind: AttributeTypeKind.MULTI_SELECT,
          dataType: AttributeDataType.TEXT,
        },
        availableFor: [AttributableType.COMPANY],
        values: addIdToValues([
          { value: 'Yazılım' },
          { value: 'Teknoloji' },
          { value: 'Finans' },
          { value: 'Lojistik' },
          { value: 'Sağlık' },
          { value: 'Eğitim' },
          { value: 'Perakende' },
          { value: 'Enerji' },
        ]),
      },
      {
        typeData: {
          name: 'Şirket Büyüklüğü',
          kind: AttributeTypeKind.SELECT,
          dataType: AttributeDataType.TEXT,
        },
        availableFor: [AttributableType.COMPANY],
        values: addIdToValues([
          { value: '1-10 Çalışan' },
          { value: '11-50 Çalışan' },
          { value: '51-200 Çalışan' },
          { value: '200+ Çalışan' },
          { value: '1000+ Çalışan' },
        ]),
      },
      {
        typeData: {
          name: 'Kuruluş Yılı',
          kind: AttributeTypeKind.SELECT,
          dataType: AttributeDataType.NUMBER,
        },
        availableFor: [AttributableType.COMPANY],
        values: addIdToValues([
          ...Array.from({ length: 226 }, (_, i) => ({
            value: String(1800 + i),
          })),
        ]),
      },
      {
        typeData: {
          name: 'Çalışma Şekli',
          kind: AttributeTypeKind.SELECT,
          dataType: AttributeDataType.TEXT,
        },
        availableFor: [AttributableType.COMPANY],
        values: addIdToValues([
          { value: 'Uzaktan' },
          { value: 'Ofis' },
          { value: 'Hibrit' },
        ]),
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
        values: addIdToValues([
          { value: '0-1M TL' },
          { value: '1-10M TL' },
          { value: '10-100M TL' },
          { value: '100M+ TL' },
        ]),
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
        values: addIdToValues([locationTree]),
      },
    ],
  },
]
