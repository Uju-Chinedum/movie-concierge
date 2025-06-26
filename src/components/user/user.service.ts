import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { pick } from 'lodash';

import { User } from './entities/user.entity';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('FIRESTORE') private readonly firestore: firestore.Firestore,
  ) {}

  async findMe(id: string) {
    const doc = await this.firestore.collection('users').doc(id).get();
    if (!doc || !doc.exists) {
      throw new BadRequestException(
        'User Not Found',
        'No user found with the provided ID.',
      );
    }

    const user = doc.data() as User;

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'User found successfully',
      data: {
        id: doc.id,
        ...pick(user, ['fullName', 'email', 'updatedAt']),
      },
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
