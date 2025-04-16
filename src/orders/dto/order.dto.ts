import { IsString, IsOptional, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, OrderStatus, PaymentStatus } from '../../common/interfaces/common.interface';

export class PaymentDetailsDto {
  @IsString()
  cardToken?: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsOptional()
  savePaymentMethod?: boolean = false;
}

export class CreateOrderDto {
  @IsString()
  shippingAddressId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
  
  @IsOptional()
  @IsString()
  trackingNumber?: string;
  
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
  
  @IsOptional()
  @IsString()
  paymentId?: string;
  
  @IsOptional()
  @IsString()
  notes?: string;
}

export class OrderFilterDto {
  @IsOptional()
  @IsString()
  status?: OrderStatus;
  
  @IsOptional()
  page?: number = 1;
  
  @IsOptional()
  limit?: number = 10;
}