import { IsString, IsNumber, IsEnum, IsOptional, Min, Max, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ArtworkCategory } from '../../common/interfaces/common.interface';

export class LocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  area?: string;
}

export class CreateArtworkDto {
  @IsString()
  title: string;

  @IsString()
  artistId: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @IsString()
  medium: string;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalImages?: string[];

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(ArtworkCategory)
  category: ArtworkCategory;

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean = false;

  @IsOptional()
  @IsBoolean()
  forSale?: boolean = true;
}

export class UpdateArtworkDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  artistId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year?: number;

  @IsOptional()
  @IsString()
  medium?: string;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalImages?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(ArtworkCategory)
  category?: ArtworkCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  forSale?: boolean;
}

export class ArtworkFilterDto {
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @IsEnum(ArtworkCategory)
  category?: ArtworkCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  forSale?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  artistId?: string;
}