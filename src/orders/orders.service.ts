import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderItem } from './schemas/order.schema';
import { Address } from '../users/schemas/user.schema';
import { CartItem } from '../cart/schemas/cart.schema';
import { CartService } from '../cart/cart.service';
import { 
  CreateOrderDto, 
  UpdateOrderStatusDto, 
  UpdatePaymentStatusDto,
  OrderFilterDto 
} from './dto/order.dto';
import { OrderStatus, PaymentStatus, PaginationResult } from '../common/interfaces/common.interface';
import { randomBytes } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Address.name) private addressModel: Model<Address>,
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItem>,
    private cartService: CartService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const { shippingAddressId, paymentMethod, paymentDetails, notes } = createOrderDto;
    
    // Get cart items
    const { items, summary } = await this.cartService.getCart(userId);
    
    if (items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    
    // Get shipping address
    const address = await this.addressModel.findOne({ _id: shippingAddressId, userId });
    
    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }
    
    // Create order items from cart items
    const orderItems = items.map(cartItem => ({
      artworkId: cartItem.artworkId,
      title: cartItem.title,
      artist: cartItem.artist,
      price: cartItem.price,
      quantity: cartItem.quantity,
      image: cartItem.image,
    }));
    
    // Generate a unique order number
    const orderNumber = this.generateOrderNumber();
    
    // Create the order
    const order = new this.orderModel({
      userId,
      orderNumber,
      items: orderItems,
      subtotal: summary.subtotal,
      tax: summary.tax,
      shipping: summary.shipping,
      total: summary.total,
      status: OrderStatus.PENDING,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? PaymentStatus.PENDING : PaymentStatus.PAID,
      shippingAddress: {
        name: address.name,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone,
      },
      notes,
      paymentId: paymentDetails?.cardToken || undefined,
    });
    
    const savedOrder = await order.save();
    
    // Clear the user's cart after successful order creation
    await this.cartService.clearCart(userId);
    
    return savedOrder;
  }

  async findAll(userId: string, filterDto: OrderFilterDto): Promise<PaginationResult<Order>> {
    const { status, page = 1, limit = 10 } = filterDto;
    
    const query = this.orderModel.find({ userId });
    
    if (status) {
      query.where('status').equals(status);
    }
    
    // Apply sorting
    query.sort({ createdAt: -1 });
    
    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);
    
    // Execute query
    const orders = await query.exec();
    const total = await this.orderModel.countDocuments(query.getFilter()).exec();
    
    return {
      items: orders,
      pagination: {
        total,
        page: +page,
        limit: +limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderModel.findOne({ _id: orderId, userId });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    return order;
  }

  async updateStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const { status, trackingNumber, notes } = updateOrderStatusDto;
    
    const order = await this.orderModel.findById(orderId);
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    order.status = status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (notes) {
      order.notes = order.notes 
        ? `${order.notes}\n\n${notes} (${new Date().toISOString()})` 
        : `${notes} (${new Date().toISOString()})`;
    }
    
    return order.save();
  }

  async updatePaymentStatus(orderId: string, updatePaymentStatusDto: UpdatePaymentStatusDto): Promise<Order> {
    const { paymentStatus, paymentId, notes } = updatePaymentStatusDto;
    
    const order = await this.orderModel.findById(orderId);
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    order.paymentStatus = paymentStatus;
    
    if (paymentId) {
      order.paymentId = paymentId;
    }
    
    if (notes) {
      order.notes = order.notes 
        ? `${order.notes}\n\nPayment: ${notes} (${new Date().toISOString()})` 
        : `Payment: ${notes} (${new Date().toISOString()})`;
    }
    
    return order.save();
  }

  private generateOrderNumber(): string {
    // Generate a random 8-character order number with a timestamp prefix
    const timestamp = Date.now().toString().substring(6); // Last 7 digits of timestamp
    const random = randomBytes(4).toString('hex').toUpperCase().substring(0, 5);
    
    return `MRK-${timestamp}-${random}`;
  }
}