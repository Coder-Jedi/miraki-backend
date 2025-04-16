import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { Address, AddressSchema } from '../users/schemas/user.schema';
import { CartModule } from '../cart/cart.module';
import { CartItem, CartItemSchema } from '../cart/schemas/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Address.name, schema: AddressSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}