import { Controller, Get } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHealth() {
    return { status: 'ok' }
  }

  @Get('ready')
  async getReady() {
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1')
      return { status: 'ready' }
    } catch {
      return { status: 'degraded' }
    }
  }
}
