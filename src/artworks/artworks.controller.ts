import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, Area } from '../common/interfaces/common.interface';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  CreateArtworkDto,
  UpdateArtworkDto,
  ArtworkFilterDto,
} from './dto/artwork.dto';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  // Public endpoints

  @Get()
  findAll(@Query() query: Record<string, any>) {
    // Clean the query object by removing null, undefined, and empty string values
    const cleanedQuery = Object.fromEntries(
      Object.entries(query).filter(
        ([_, value]) => value !== null && value !== undefined && value !== '',
      ),
    );

    const dto = plainToInstance(ArtworkFilterDto, cleanedQuery, {
      enableImplicitConversion: false, // important!
    });

    const errors = validateSync(dto);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return this.artworksService.findAll(dto);
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit: number) {
    const artworks = await this.artworksService.findFeatured(limit);
    return {
      success: true,
      data: {
        artworks,
      },
    };
  }

  @Get('categories')
  async getCategories() {
    const categories = await this.artworksService.getCategories();
    return {
      success: true,
      data: {
        categories,
      },
    };
  }

  @Get('areas')
  async getAreas() {
    const areas = Object.values(Area);
    return {
      success: true,
      data: {
        areas,
      },
    };
  }

  @Get('artist/:artistId')
  async findByArtist(
    @Param('artistId') artistId: string,
    @Query() query: Record<string, any>,
  ) {
    // Clean the query object by removing null, undefined, and empty string values
    const cleanedQuery = Object.fromEntries(
      Object.entries(query).filter(
        ([_, value]) => value !== null && value !== undefined && value !== '',
      ),
    );

    const dto = plainToInstance(
      ArtworkFilterDto,
      {
        ...cleanedQuery,
        artistId, // Add the artistId from the path parameter
      },
      {
        enableImplicitConversion: false,
      },
    );

    const errors = validateSync(dto);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    const result = await this.artworksService.findAll(dto);
    return {
      success: true,
      data: result,
    };
  }

  // Make sure this route comes AFTER all other specific routes
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const artwork = await this.artworksService.findById(id);
    const relatedArtworks = await this.artworksService.findRelated(id);

    return {
      success: true,
      data: {
        ...artwork.toObject(),
        relatedArtworks,
      },
    };
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async toggleLike(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    const result = await this.artworksService.toggleLike(id, userId);
    return {
      success: true,
      data: result,
    };
  }

  // Admin endpoints

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ARTIST)
  async create(@Body() createArtworkDto: CreateArtworkDto) {
    const artwork = await this.artworksService.create(createArtworkDto);
    return {
      success: true,
      data: artwork,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ARTIST)
  async update(
    @Param('id') id: string,
    @Body() updateArtworkDto: UpdateArtworkDto,
  ) {
    const artwork = await this.artworksService.update(id, updateArtworkDto);
    return {
      success: true,
      data: artwork,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ARTIST)
  async remove(@Param('id') id: string) {
    await this.artworksService.remove(id);
    return {
      success: true,
      message: 'Artwork deleted successfully',
    };
  }
}
