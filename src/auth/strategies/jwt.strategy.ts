import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserType } from '@prisma/client';

interface JwtPayload {
  email: string;
  sub: string;
  type: UserType;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('SUPABASE_JWT_SECRET');
    if (!jwtSecret) {
      throw new UnauthorizedException('SUPABASE_JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,  // Utilisation de SUPABASE_JWT_SECRET
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,  // Map sub to id for backward compatibility
      sub: payload.sub,
      email: payload.email,
      type: payload.type,
    };
  }
}
