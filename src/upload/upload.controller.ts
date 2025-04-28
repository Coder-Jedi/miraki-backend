import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/interfaces/common.interface';
import { UploadService } from './upload.service';
import { UploadResult } from './interfaces/upload.interface';

@Controller('admin/upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('artwork')
  @UseInterceptors(FileInterceptor('image'))
  async uploadArtworkImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('artworkId') artworkId?: string,
  ): Promise<UploadResult> {
    const result = await this.uploadService.uploadFile(
      file,
      'artworks',
      artworkId ? `artwork_${artworkId}_${Date.now()}` : undefined,
    );

    return {
      success: true,
      data: {
        url: result.url,
        key: result.key,
      },
    };
  }

  @Post('artist')
  @UseInterceptors(FileInterceptor('image'))
  async uploadArtistImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('artistId') artistId?: string,
  ): Promise<UploadResult> {
    const result = await this.uploadService.uploadFile(
      file,
      'artists',
      artistId ? `artist_${artistId}_${Date.now()}` : undefined,
    );

    return {
      success: true,
      data: {
        url: result.url,
        key: result.key,
      },
    };
  }

  @Post('banner')
  @UseInterceptors(FileInterceptor('image'))
  async uploadBannerImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResult> {
    const result = await this.uploadService.uploadFile(
      file,
      'banners',
      `banner_${Date.now()}`,
    );

    return {
      success: true,
      data: {
        url: result.url,
        key: result.key,
      },
    };
  }
}