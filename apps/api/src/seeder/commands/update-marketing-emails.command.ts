import { Command } from 'nestjs-command'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { isEmail } from 'class-validator'

@Injectable()
export class UpdateMarketingEmailsCommand {
  private readonly logger = new Logger(UpdateMarketingEmailsCommand.name)

  constructor(private readonly prisma: PrismaService) {}

  @Command({
    command: 'update:marketing-emails',
    describe: 'Update marketing email addresses for channels',
  })
  async updateMarketingEmails(): Promise<void> {
    this.logger.log('Updating marketing emails...')

    const rawEmails = process.env.MARKETING_EMAILS?.split(',').map((email) =>
      email.trim(),
    )

    if (!rawEmails || rawEmails.length === 0) {
      this.logger.error('MARKETING_EMAILS is not set or is empty')
      return
    }

    // Validate emails
    const validEmails: string[] = []
    const invalidEmails: string[] = []

    for (const email of rawEmails) {
      if (isEmail(email)) {
        validEmails.push(email)
      } else {
        invalidEmails.push(email)
      }
    }

    // Log invalid emails
    if (invalidEmails.length > 0) {
      this.logger.warn(
        `Invalid email addresses found: ${invalidEmails.join(', ')}`,
      )
    }

    // Check if we have any valid emails
    if (validEmails.length === 0) {
      this.logger.error(
        'No valid email addresses found. Cannot update marketing emails.',
      )
      return
    }

    // Update with valid emails
    await this.prisma.channel.update({
      where: { token: 'ch_main_tenant_1' },
      data: {
        marketingEmails: validEmails,
      },
    })

    this.logger.log(
      `Marketing emails updated successfully with ${validEmails.length} valid email(s): ${validEmails.join(', ')}`,
    )
  }
}
