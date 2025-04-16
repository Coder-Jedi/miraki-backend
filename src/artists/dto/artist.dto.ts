import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../artworks/dto/artwork.dto';

// Export the AreaCount interface for use in controller
export interface AreaCount {
  name: string;
  count: number;
  location: {
    lat: number;
    lng: number;
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
}

export class ArtistFilterDto {
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'popularity';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
