import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { 
  CreateOrderDto, 
  UpdateOrderStatusDto, 
  UpdatePaymentStatusDto,
  OrderFilterDto 
} from './dto/order.dto';
import { UserRole } from '../common/interfaces/common.interface';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @CurrentUser('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.ordersService.create(userId, createOrderDto);
    return {
      success: true,
      data: {
        order,
      },
    };
  }

  @Get()
  async getOrders(
    @CurrentUser('userId') userId: string,
    @Query() filterDto: OrderFilterDto,
  ) {
    const result = await this.ordersService.findAll(userId, filterDto);
    return {
      success: true,
      data: {
        orders: result.items,
        pagination: result.pagination,
      },
    };
  }

  @Get(':id')
  async getOrderById(
    @CurrentUser('userId') userId: string,
    @Param('id') orderId: string,
  ) {
    const order = await this.ordersService.findOne(userId, orderId);
    return {
      success: true,
      data: order,
    };
  }

  // Admin endpoints for order management

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.ordersService.updateStatus(
      orderId,
      updateOrderStatusDto,
    );
    return {
      success: true,
      data: order,
    };
  }

  @Put(':id/payment')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updatePaymentStatus(
    @Param('id') orderId: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    const order = await this.ordersService.updatePaymentStatus(
      orderId,
      updatePaymentStatusDto,
    );
    return {
      success: true,
      data: order,
    };
  }
}