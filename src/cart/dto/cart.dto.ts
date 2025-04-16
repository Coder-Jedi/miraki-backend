import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class AddCartItemDto {
  @IsNotEmpty()
  @IsString()
  artworkId: string;

  @IsNumber()
  @Min(1)
  quantity: number = 1;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}