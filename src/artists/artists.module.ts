import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { Artwork, ArtworkSchema } from '../artworks/schemas/artwork.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Artwork.name, schema: ArtworkSchema },
    ]),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}