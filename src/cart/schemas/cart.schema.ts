import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
})
export class CartItem extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Artwork' })
  artworkId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 1, min: 1 })
  quantity: number;

  @Prop({ required: true })
  image: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);