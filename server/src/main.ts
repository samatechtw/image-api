import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'
import { apiConfig } from './config'

const run = async () => {
  const port = apiConfig.get('port')
  const referers = apiConfig.get('authorizedReferrers').split(',')
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors({
    origin: referers,
    credentials: true,
  })

  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Image API')
      .setDescription('Image service for optimizing, processing, and storing images.')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('docs', app, document)
  }

  // Global pipe settings
  app.useGlobalPipes(
    new ValidationPipe({
      // Print extra warning messages to the console
      enableDebugMessages: true,
      // Automatically transform payloads to be objects typed according to their DTO classes
      transform: true,
      // Strip validated (returned) object of properties that do not use validation decorators
      whitelist: true,
      // Throw an exception instead of stripping non-whitelisted properties
      forbidNonWhitelisted: true,
      // Attempts to validate unknown objects fail immediately
      forbidUnknownValues: true,
      // Disable detailed errors in sensitive environments (e.g. prod)
      // disableErrorMessages: true,
    }),
  )

  // Enable DI in class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(port, () => {
    Logger.log(`Listening on http://localhost:${port}`)
  })
}

run()
