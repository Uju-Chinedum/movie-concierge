import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../user/entities/user.entity';
import { SignInResponseDto } from './dto/sign-in.dto';
import { AppResponse, UserResponse } from '../../common/types';
import { successResponse } from '../../common/app';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_ATTRIBUTES } from '../../common/constants';
import { DBUtils } from '../../common/Utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  private async signToken(
    id: string,
    email: string,
  ): Promise<AppResponse<SignInResponseDto>> {
    const payload = {
      sub: id,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15d',
      secret,
    });

    return successResponse('Signed In', { email, accessToken: token });
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<AppResponse<UserResponse>> {
    try {
      return DBUtils.createEntity(
        this.userModel,
        createUserDto,
        USER_ATTRIBUTES,
        'User created successfully',
      );
    } catch (error) {
      throw error;
    }
  }
}
