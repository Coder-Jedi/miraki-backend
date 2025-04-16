import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { 
  OrderStatus, 
  PaymentMethod, 
  PaymentStatus 
} from '../../common/interfaces/common.interface';

@Schema()
export class OrderItem {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Artwork' })
  artworkId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  image: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema()
export class ShippingAddress {
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
}

export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

@Schema({
  timestamps: true,
})
export class Order extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  orderNumber: string;
  
  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];
  
  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;
  
  @Prop({ required: true })
  subtotal: number;
  
  @Prop({ required: true })
  shipping: number;
  
  @Prop({ required: true })
  tax: number;
  
  @Prop({ required: true })
  total: number;
  
  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
  
  @Prop({
    type: String,
    enum: Object.values(PaymentMethod),
    required: true,
  })
  paymentMethod: PaymentMethod;
  
  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;
  
  @Prop()
  paymentId?: string;
  
  @Prop()
  trackingNumber?: string;
  
  @Prop()
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);