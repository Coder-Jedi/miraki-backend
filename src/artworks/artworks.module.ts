import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtworksController } from './artworks.controller';
import { ArtworksService } from './artworks.service';
import { Artwork, ArtworkSchema } from './schemas/artwork.schema';
import { Artist, ArtistSchema } from '../artists/schemas/artist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artwork.name, schema: ArtworkSchema },
      { name: Artist.name, schema: ArtistSchema },
    ]),
  ],
  controllers: [ArtworksController],
  providers: [ArtworksService],
  exports: [ArtworksService],
})
export class ArtworksModule {}