import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { hash } from 'argon2';

export type UserDocument = User &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, trim: true })
  fullName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64,
    select: false,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await hash(this.password);
    next();
  } catch (err) {
    next(err);
  }
});
