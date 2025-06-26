import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { firestore } from 'firebase-admin';

import { User } from '../../user/entities/user.entity';

import { UnauthorizedException } from '../../../common/exceptions';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject('FIRESTORE') private readonly firestore: firestore.Firestore,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Invalid Credentials',
        'No token provided',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      const doc = await this.firestore
        .collection('users')
        .doc(payload.sub)
        .get();
      if (!doc || !doc.exists) {
        throw new UnauthorizedException(
          'Invalid Credentials',
          'User not found.',
        );
      }

      const user = { id: doc.id, ...doc.data() } as User;
      request.user = user;
      context.switchToHttp().getRequest().user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException(
        'Incalid Credentials',
        'Invalid or expired token',
      );
    }
  }

  private getRequest(context: ExecutionContext): any {
    const ctx = context.switchToHttp().getRequest();
    return ctx.handshake !== undefined ? ctx.handshake : ctx;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (!authHeader || typeof authHeader !== 'string') return null;

    const [, token] = authHeader.split(' ');
    return token || null;
  }
}
