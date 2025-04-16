import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole, AddressType } from '../../common/interfaces/common.interface';

@Schema({
  timestamps: true,
})
export class Address extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: String,
    enum: Object.values(AddressType),
    default: AddressType.HOME,
  })
  type: AddressType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  line1: string;

  @Prop()
  line2?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  phone?: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  profileImage?: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Artwork' }] })
  favorites: string[];

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);