import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. API / Mobile / SPA
        ExtractJwt.fromAuthHeaderAsBearerToken(),

        // 2. Admin SSR (cookie)
        (req: any) => req?.cookies?.jwt,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret', // Use environment variable for production
    });
  }

  async validate(payload: any) {
    return { user_oid: payload.sub, username: payload.username || '' };
  }
}
