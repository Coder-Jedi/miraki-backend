import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser('userId') userId: string) {
    const cart = await this.cartService.getCart(userId);
    return {
      success: true,
      data: cart,
    };
  }

  @Post('items')
  async addItem(
    @CurrentUser('userId') userId: string,
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    const result = await this.cartService.addItem(userId, addCartItemDto);
    return {
      success: true,
      data: result,
    };
  }

  @Put('items/:itemId')
  async updateItem(
    @CurrentUser('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const result = await this.cartService.updateItem(userId, itemId, updateCartItemDto);
    return {
      success: true,
      data: result,
    };
  }

  @Delete('items/:itemId')
  async removeItem(
    @CurrentUser('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    const result = await this.cartService.removeItem(userId, itemId);
    return {
      success: true,
      data: result,
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearCart(@CurrentUser('userId') userId: string) {
    await this.cartService.clearCart(userId);
    return {
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items: [],
        summary: {
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
        },
      },
    };
  }
}