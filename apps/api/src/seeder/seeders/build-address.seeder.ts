import { Injectable, Logger } from '@nestjs/common'
import { Command } from 'nestjs-command'
import { PrismaService } from 'src/common'
import slugify from 'slugify'
import { trProviences } from '../data/tr-proviences'
import { trDistricts } from '../data/tr-districts'
import { trNeighborhoods } from '../data/tr-neighborhoods'
import { trVillages } from '../data/tr-villages'
import * as fs from 'fs'

type Province = {
  id: number
  name: string
}

type District = {
  id: number
  provinceId: number
  name: string
}

type AreaUnit = {
  id: number
  districtId: number
  provinceId: number
  name: string
  population?: number
}

type OutputNode = {
  id: string
  value: string
  children?: OutputNode[]
}

@Injectable()
export class BuildAddressJsonSeeder {
  private readonly logger = new Logger(BuildAddressJsonSeeder.name)

  constructor(private readonly prisma: PrismaService) {}

  @Command({
    command: 'build:address-json',
    describe: 'Builds the address json',
  })
  buildAddressJson() {
    const tree = this.convertToHierarchy(
      trProviences,
      trDistricts,
      trNeighborhoods,
      trVillages,
    )

    fs.writeFileSync(
      'src/seeder/data/tr-address-tree.ts',
      `export const locationTree = ${JSON.stringify(tree, null, 2)};`,
    )
  }

  private convertToHierarchy(
    provinces: Province[],
    districts: District[],
    neighborhoods: AreaUnit[],
    villages: AreaUnit[],
  ): OutputNode {
    const allAreas = [...neighborhoods, ...villages]

    // First, build a map of provinceId to slug
    const provinceSlugMap = provinces.reduce<Record<number, string>>(
      (acc, province) => {
        acc[province.id] = slugify(province.name, {
          lower: true,
          replacement: '',
        })
        return acc
      },
      {},
    )

    // Build a map of districtId to { slug, provinceId }
    const districtSlugMap = districts.reduce<
      Record<number, { slug: string; provinceId: number }>
    >((acc, district) => {
      acc[district.id] = {
        slug: slugify(district.name, {
          lower: true,
          replacement: '',
        }),
        provinceId: district.provinceId,
      }
      return acc
    }, {})

    const provincesMap = provinces.reduce<Record<number, OutputNode>>(
      (acc, province) => {
        const provinceSlug = provinceSlugMap[province.id]
        acc[province.id] = {
          id: provinceSlug,
          value: province.name,
          children: [],
        }
        return acc
      },
      {},
    )

    const districtsMap = districts.reduce<Record<number, OutputNode>>(
      (acc, district) => {
        const provinceSlug = provinceSlugMap[district.provinceId]
        const districtSlug = slugify(district.name, {
          lower: true,
          replacement: '',
        })
        acc[district.id] = {
          id: `${provinceSlug}-${districtSlug}`,
          value: district.name,
          children: [],
        }
        const provinceNode = provincesMap[district.provinceId]
        if (provinceNode) {
          provinceNode.children!.push(acc[district.id])
        }
        return acc
      },
      {},
    )

    for (const area of allAreas) {
      const districtNode = districtsMap[area.districtId]
      const districtInfo = districtSlugMap[area.districtId]
      if (districtNode && districtInfo) {
        const provinceSlug = provinceSlugMap[districtInfo.provinceId]
        const districtSlug = districtInfo.slug
        const areaSlug = slugify(area.name, {
          lower: true,
          replacement: '',
        })
        districtNode.children!.push({
          id: `${provinceSlug}-${districtSlug}-${areaSlug}`,
          value: area.name,
        })
      }
    }

    return {
      id: 'tr',
      value: 'Türkiye',
      children: Object.values(provincesMap),
    }
  }
}
