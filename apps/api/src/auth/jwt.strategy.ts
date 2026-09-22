import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_HERE', // পরবর্তীতে আমরা এটি .env ফাইলে সরিয়ে নেব
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, tenantId: payload.tenantId };
  }
}