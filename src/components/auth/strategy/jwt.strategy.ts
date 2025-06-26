import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firestore } from 'firebase-admin';

import { UnauthorizedException } from '../../../common/exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @Inject('FIRESTORE') private readonly firestore: firestore.Firestore,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const doc = await this.firestore.collection('users').doc(payload.sub).get();
    if (!doc || !doc.exists) {
      throw new UnauthorizedException('Invalid Credentials', 'User not found');
    }

    const user = doc.data();
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials', 'User not found');
    }

    return {
      id: doc.id,
      email: user.email,
      updatedAt: user.updatedAt,
    };
  }
}
