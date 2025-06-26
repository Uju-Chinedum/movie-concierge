import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  imports: [JwtModule.register({})],
})
export class UserModule {}
