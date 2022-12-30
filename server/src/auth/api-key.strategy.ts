import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { HeaderAPIKeyStrategy } from 'passport-headerapikey'
import { apiConfig } from '../config'

type DoneFunction = (error: Error | null, result?: unknown) => void

@Injectable()
export class apiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'apiKey') {
  constructor() {
    super(
      { header: 'X-IMAGE-API-KEY', prefix: '' },
      true,
      async (apiKey: string, done: DoneFunction) => {
        return this.validate(apiKey, done)
      },
    )
  }

  validate(apiKey: string, done: DoneFunction): void {
    const imageApiKey = apiConfig.get('imageApiKey')

    // Validate imageApiKey
    if (apiKey === imageApiKey) {
      return done(null, {})
    }

    return done(new UnauthorizedException())
  }
}
