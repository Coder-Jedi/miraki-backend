import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Location, SocialLinks } from '../../common/interfaces/common.interface';

@Schema({
  timestamps: true,
})
export class Artist extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  bio?: string;

  @Prop({ type: Object })
  location?: Location;

  @Prop()
  profileImage?: string;

  @Prop({ type: Object })
  socialLinks?: SocialLinks;

  @Prop({ default: 0, min: 0, max: 5 })
  popularity: number;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);