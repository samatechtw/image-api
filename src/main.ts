import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

const run = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  await app.listen(3000)
}

run()
