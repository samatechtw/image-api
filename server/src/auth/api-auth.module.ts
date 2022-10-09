import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AnonymousStrategy } from './anonymous.strategy'
import { apiKeyStrategy } from './api-key.strategy'

@Module({
  imports: [PassportModule],
  controllers: [],
  providers: [apiKeyStrategy, AnonymousStrategy],
  exports: [],
})
export class ApiAuthModule {}
