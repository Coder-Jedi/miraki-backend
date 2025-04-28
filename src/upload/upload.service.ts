import { Injectable, BadRequestException } from '@nestjs/common';
import ImageKit = require('imagekit');
import { FileUploadResponse } from './interfaces/upload.interface';

@Injectable()
export class UploadService {
  private imagekit: ImageKit;

  constructor() {
    this.imagekit = new ImageKit({
      publicKey:
        process.env.IMAGEKIT_PUBLIC_KE || 'public_PISh+98/rYRQmpo+z5LGeFXCKEg=',
      privateKey:
        process.env.IMAGEKIT_PRIVATE_KE ||
        'private_62U/Nz1VLAGr+BseBYX2w3fSgOE=',
      urlEndpoint:
        process.env.IMAGEKIT_URL_ENDPOIN ||
        'https://ik.imagekit.io/mirakiadmin/',
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    fileName?: string,
  ): Promise<FileUploadResponse> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      // Generate a unique file name or use the provided one
      const uniqueFileName = fileName || `${Date.now()}-${file.originalname}`;
      
      // Upload file to ImageKit
      const result = await this.imagekit.upload({
        file: file.buffer,
        fileName: uniqueFileName,
        folder: `miraki/${folder}`, // Organize files in folders by type
      });

      return {
        url: result.url,
        key: `${folder}/${result.name}`,
        fileId: result.fileId,
        name: result.name,
        size: result.size,
        fileType: result.fileType,
      };
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.imagekit.deleteFile(fileId);
    } catch (error) {
      throw new BadRequestException(`File deletion failed: ${error.message}`);
    }
  }
}