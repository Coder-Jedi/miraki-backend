import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItem, CartItemSchema } from './schemas/cart.schema';
import { Artwork, ArtworkSchema } from '../artworks/schemas/artwork.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
      { name: Artwork.name, schema: ArtworkSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}