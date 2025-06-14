// src/command.ts
import { NestFactory } from '@nestjs/core'
import { CommandService } from 'nestjs-command'
import { AppModule } from 'src/app.module'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  try {
    await app.get(CommandService).exec()
  } catch (error) {
    console.error(error)
  } finally {
    await app.close()
  }
}

bootstrap()
