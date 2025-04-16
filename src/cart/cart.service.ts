import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem } from './schemas/cart.schema';
import { Artwork } from '../artworks/schemas/artwork.schema';
import { AddCartItemDto, UpdateCartItemDto, CartSummary } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItem>,
    @InjectModel(Artwork.name) private artworkModel: Model<Artwork>,
  ) {}

  async getCart(
    userId: string,
  ): Promise<{ items: CartItem[]; summary: CartSummary }> {
    const items = await this.cartItemModel
      .find({ userId })
      .sort({ createdAt: -1 });
    const summary = this.calculateSummary(items);

    return { items, summary };
  }

  async addItem(
    userId: string,
    addCartItemDto: AddCartItemDto,
  ): Promise<{ item: CartItem; cart: { summary: CartSummary } }> {
    const { artworkId, quantity } = addCartItemDto;

    // Check if the artwork exists and is for sale
    const artwork = await this.artworkModel.findById(artworkId);

    if (!artwork) {
      throw new NotFoundException('Artwork not found');
    }

    if (!artwork.forSale) {
      throw new BadRequestException(
        'This artwork is not available for purchase',
      );
    }

    // Check if the item is already in the cart
    let cartItem = await this.cartItemModel.findOne({ userId, artworkId });

    if (cartItem) {
      // Update quantity if already in cart
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = new this.cartItemModel({
        userId,
        artworkId,
        title: artwork.title,
        artist: artwork.artist,
        price: artwork.price,
        quantity,
        image: artwork.image,
      });

      await cartItem.save();
    }

    // Get updated cart summary
    const items = await this.cartItemModel.find({ userId });
    const summary = this.calculateSummary(items);

    return { item: cartItem, cart: { summary } };
  }

  async updateItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<{ items: CartItem[]; summary: CartSummary }> {
    const cartItem = await this.cartItemModel.findOne({ _id: itemId, userId });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    await cartItem.save();

    // Get updated cart
    const items = await this.cartItemModel.find({ userId });
    const summary = this.calculateSummary(items);

    return { items, summary };
  }

  async removeItem(
    userId: string,
    itemId: string,
  ): Promise<{ items: CartItem[]; summary: CartSummary }> {
    const result = await this.cartItemModel.deleteOne({ _id: itemId, userId });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Cart item not found');
    }

    // Get updated cart
    const items = await this.cartItemModel.find({ userId });
    const summary = this.calculateSummary(items);

    return { items, summary };
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartItemModel.deleteMany({ userId });
  }

  private calculateSummary(items: CartItem[]): CartSummary {
    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Calculate shipping cost (simplified - could be more complex based on requirements)
    // Free shipping for orders over 5000, otherwise 50
    const shipping = subtotal > 5000 ? 0 : 50;

    // Calculate tax (e.g., 5% of subtotal)
    const taxRate = 0.05;
    const tax = Math.round(subtotal * taxRate);

    // Calculate total
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
    };
  }
}
