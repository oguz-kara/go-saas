import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
  ConflictException,
} from '@nestjs/common'
import { Request } from 'express'
import { Public } from 'src/common/decorators/public.decorator'
import { ApiKeyGuard } from 'src/common/guards/api-key.guard'
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard'
import { RequestContext } from 'src/common/request-context/request-context'
import { LeadService } from '../../application/services/lead.service'
import { CreatePublicLeadDto } from './dto/create-public-lead.dto'
import { ValidatedApiKey } from 'src/modules/api-key/domain/api-key.interface'

interface PublicLeadResponse {
  success: boolean
  message: string
  leadId?: string
}

@Controller('api/public/leads')
export class LeadController {
  private readonly logger = new Logger(LeadController.name)

  constructor(private readonly leadService: LeadService) {}

  @Public()
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLead(
    @Body() dto: CreatePublicLeadDto,
    @Req() req: Request,
  ): Promise<PublicLeadResponse> {
    const apiKey = req['apiKey'] as ValidatedApiKey
    const ipAddress = req['ipAddress'] as string

    this.logger.log(
      `Creating lead from public API: ${dto.email} via ${apiKey.name} from IP ${ipAddress}`,
    )

    try {
      // Create a minimal RequestContext for the lead service
      const ctx = RequestContext.createInstance({
        channel: { token: apiKey.channelToken },
        user: undefined,
      })

      const lead = await this.leadService.createLead(
        ctx,
        {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phone: dto.phone,
          company: dto.company,
          jobTitle: dto.jobTitle,
          website: dto.website,
          source: dto.source,
          // Store the message in painPoints field if provided
          painPoints: dto.message,
        },
        apiKey.channelToken,
      )

      this.logger.log(`Lead created successfully: ${lead.id}`)

      return {
        success: true,
        message: 'Lead created successfully. We will contact you soon!',
        leadId: lead.id,
      }
    } catch (error) {
      this.logger.error('Failed to create lead from public API', error?.stack)

      // Handle duplicate email
      if (error?.code === 'P2002' || error instanceof ConflictException) {
        return {
          success: true,
          message:
            'Thank you! We have already received your information and will be in touch soon.',
        }
      }

      // Generic error response (don't expose internal details)
      throw new Error(
        'Unable to process your request at this time. Please try again later.',
      )
    }
  }
}
