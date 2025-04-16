import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ArtworkCategory, Location } from '../../common/interfaces/common.interface';

@Schema({
  timestamps: true,
})
export class Artwork extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string; // Artist name for display

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Artist' })
  artistId: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  medium: string;

  @Prop()
  dimensions?: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: [String], default: [] })
  additionalImages: string[];

  @Prop({ type: Object, required: true })
  location: Location;

  @Prop({ min: 0 })
  price?: number;

  @Prop({
    type: String,
    enum: Object.values(ArtworkCategory),
    required: true,
  })
  category: ArtworkCategory;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [String], default: [] })
  likedBy: string[];

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: true })
  forSale: boolean;
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);