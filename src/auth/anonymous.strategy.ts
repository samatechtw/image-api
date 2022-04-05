import { Strategy } from 'passport-anonymous'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy, 'anonymous') {
  constructor() {
    super()
  }

  // TODO: Not clear if this is the correct way of doing it
  // https://stackoverflow.com/q/59150385/2619188
  authenticate() {
    return this.success()
  }
}
