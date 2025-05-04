import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsObject,
  Min,
  Max,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { LocationDto } from '../../artworks/dto/artwork.dto';
import { Area } from '../../common/interfaces/common.interface';

function toUndefinedIfEmpty({ value }) {
  return value === undefined || value === null || value === '' ? undefined : value;
}

function transformNumber({ value }) {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

function transformBoolean({ value }) {
  if (value === undefined || value === null || value === '') return undefined;
  if (value === 'true' || value === '1' || value === true) return true;
  if (value === 'false' || value === '0' || value === false) return false;
  return undefined;
}

// Export the AreaCount interface for use in controller
export interface AreaCount {
  name: string;
  count: number;
  location: {
    lat?: number;
    lng?: number;
  };
}

export class SocialLinksDto {
  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  facebook?: string;
}

export class CreateArtistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  popularity?: number = 0;

  @IsOptional()
  @IsBoolean()
  featured?: boolean = false;
}

export class UpdateArtistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  popularity?: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

export class ArtistFilterDto {
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
  @IsEnum(Area)
  @Transform(toUndefinedIfEmpty)
  area?: Area;

  @IsOptional()
  @Transform(toUndefinedIfEmpty)
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(toUndefinedIfEmpty)
  @IsString()
  location?: string;

  @IsOptional()
  @Transform(transformBoolean)
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @Transform(toUndefinedIfEmpty)
  @IsString()
  sortBy?: string = 'popularity';

  @IsOptional()
  @Transform(toUndefinedIfEmpty)
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
