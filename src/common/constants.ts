import { UserDocument } from "../components/user/entities/user.entity";

export const USER_ATTRIBUTES: Array<keyof UserDocument> = [
  '_id',
  'fullName',
  'email',
  'createdAt',
];
