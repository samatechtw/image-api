import { NestFactory } from '@nestjs/core'
import { AppModule } from './http/app.module'
import { NestExpressApplication } from '@nestjs/platform-express'

let run = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  await app.listen(3000)
}

run()
