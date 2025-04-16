import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { AddressType } from '../../common/interfaces/common.interface';

// AddressDto is an alias for CreateAddressDto
export { CreateAddressDto as AddressDto };

export class CreateAddressDto {
  @IsEnum(AddressType)
  type: AddressType;

  @IsString()
  name: string;

  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  line1?: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}
