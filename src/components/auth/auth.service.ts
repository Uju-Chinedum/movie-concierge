import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firestore } from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

import { User } from '../user/entities/user.entity';

import { SignInDto, SignInResponseDto } from './dto/sign-in.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UnauthorizedException } from '../../common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FIRESTORE') private readonly firestore: firestore.Firestore,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  private userCollection() {
    return this.firestore.collection('users');
  }

  private async signToken(id: string, email: string) {
    const payload = {
      sub: id,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15d',
      secret,
    });

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Signed In',
      data: { email, accessToken: token },
    };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hash(createUserDto.password);

      const user: User = {
        ...createUserDto,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userRef = await this.userCollection().add(user);
      return {
        success: true,
        status: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: {
          id: userRef.id,
          ...user,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async signIn(body: SignInDto) {
    const snapshot = await this.userCollection()
      .where('email', '==', body.email)
      .get();
    if (!snapshot || snapshot.empty) {
      throw new UnauthorizedException(
        'Invalid Credentials',
        'The email you entered does not match any account',
      );
    }

    const user = snapshot.docs[0];

    const passwordValid = await verify(user.data().password, body.password);
    if (!passwordValid) {
      throw new UnauthorizedException(
        'Invalid credentials',
        'The password you entered is incorrect',
      );
    }

    return await this.signToken(user.id, user.data().email);
  }
}
