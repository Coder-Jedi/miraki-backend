import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { CreateArtworkDto, UpdateArtworkDto, ArtworkFilterDto } from './dto/artwork.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/interfaces/common.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  // Public endpoints

  @Get()
  async findAll(@Query() filterDto: ArtworkFilterDto) {
    const result = await this.artworksService.findAll(filterDto);
    return {
      success: true,
      data: {
        artworks: result.items,
        pagination: result.pagination,
      },
    };
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