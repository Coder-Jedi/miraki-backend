import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ArtworkCategory, Area } from '../../common/interfaces/common.interface';

function toUndefinedIfEmpty({ value }) {
  return value === undefined || value === null || value === ''
    ? undefined
    : value;
}

function transformNumber({ value }) {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

function transformBoolean({ value }) {
  if (value === undefined || value === null || value === '') return undefined;
  return value === 'true' || value === true;
}

export class LocationDto {
  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsEnum(Area)
  area: Area;
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

  @IsOptional()
  @IsString()
  medium?: string;

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
  @Transform(transformNumber)
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(transformNumber)
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @IsEnum(ArtworkCategory)
  @Transform(toUndefinedIfEmpty)
  category?: ArtworkCategory;

  @IsOptional()
  @Transform(transformNumber)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(transformNumber)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(Area)
  @Transform(toUndefinedIfEmpty)
  location?: Area;

  @IsOptional()
  @Transform(transformBoolean)
  @Type(() => Boolean)
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @Transform(transformBoolean)
  @Type(() => Boolean)
  @IsBoolean()
  forSale?: boolean;

  @IsOptional()
  @Transform(toUndefinedIfEmpty)
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(toUndefinedIfEmpty)
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @Transform(toUndefinedIfEmpty)
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Transform(toUndefinedIfEmpty)
  @IsString()
  artistId?: string;
}
