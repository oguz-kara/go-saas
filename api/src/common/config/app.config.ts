import { ConfigFactory, ConfigObject } from '@nestjs/config'

export const appConfig: ConfigFactory<ConfigObject> = (): ConfigObject => ({
  app: {
    officialName: 'Restoreplus Hi-Tech Lubricants',
    name: 'Restoreplus',
  },
})

export type AppConfigType = typeof appConfig
