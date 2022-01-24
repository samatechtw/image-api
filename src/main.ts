import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import AppModule from './http/AppModule'

let run = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  await app.listen(3000)
}

run()
