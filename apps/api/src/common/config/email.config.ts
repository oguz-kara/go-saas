import { ConfigFactory, ConfigObject } from '@nestjs/config'

export const emailConfig: ConfigFactory<ConfigObject> = (): ConfigObject => ({
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: {
      name: process.env.SMTP_FROM_NAME || 'DoluCRM',
      email: process.env.SMTP_FROM_EMAIL || 'noreply@dolucrm.com',
    },
  },
})

export type EmailConfigType = typeof emailConfig
