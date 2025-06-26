import { User } from '../components/user/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
