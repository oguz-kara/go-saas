import { ConfigFactory, ConfigObject } from '@nestjs/config'

export const appConfig: ConfigFactory<ConfigObject> = (): ConfigObject => ({
  app: {
    officialName: 'Restoreplus Hi-Tech Lubricants',
    name: 'Restoreplus',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
  },
})

export type AppConfigType = typeof appConfig
