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
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto, ArtistFilterDto } from './dto/artist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/interfaces/common.interface';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  // Public endpoints

  @Get()
  async findAll(@Query() filterDto: ArtistFilterDto) {
    const result = await this.artistsService.findAll(filterDto);
    return {
      success: true,
      data: {
        artists: result.items,
        pagination: result.pagination,
      },
    };
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit: number) {
    const artists = await this.artistsService.findFeatured(limit);
    return {
      success: true,
      data: {
        artists,
      },
    };
  }

  @Get('by-area')
  async getArtistsByArea() {
    const areas = await this.artistsService.getArtistsByArea();
    return {
      success: true,
      data: {
        areas,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { artist, artworks } = await this.artistsService.findById(id);
    return {
      success: true,
      data: {
        ...artist.toObject(),
        artworks,
      },
    };
  }

  // Admin endpoints

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createArtistDto: CreateArtistDto) {
    const artist = await this.artistsService.create(createArtistDto);
    return {
      success: true,
      data: artist,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const artist = await this.artistsService.update(id, updateArtistDto);
    return {
      success: true,
      data: artist,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.artistsService.remove(id);
    return {
      success: true,
      message: 'Artist deleted successfully',
    };
  }
}