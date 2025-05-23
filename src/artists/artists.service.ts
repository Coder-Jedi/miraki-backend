import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist } from './schemas/artist.schema';
import { Artwork } from '../artworks/schemas/artwork.schema';
import {
  CreateArtistDto,
  UpdateArtistDto,
  ArtistFilterDto,
  AreaCount,
} from './dto/artist.dto';
import { PaginationResult } from '../common/interfaces/common.interface';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<Artist>,
    @InjectModel(Artwork.name) private artworkModel: Model<Artwork>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = new this.artistModel(createArtistDto);
    return newArtist.save();
  }

  async findAll(filterDto: ArtistFilterDto): Promise<PaginationResult<Artist>> {
    const {
      page = 1,
      limit = 20,
      search,
      location,
      featured,
      sortBy = 'popularity',
      sortOrder = 'desc',
    } = filterDto;

    const query = this.artistModel.find();

    // Apply filters
    if (search) {
      query.where({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (location) {
      query.where('location.area').equals(location);
    }
    
    if (featured !== undefined) {
      query.where('featured').equals(featured);
    }

    // Apply sorting
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    query.sort({ [sortBy]: sortDirection });

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    // Execute query
    const artists = await query.exec();
    const total = await this.artistModel
      .countDocuments(query.getFilter())
      .exec();

    return {
      items: artists,
      pagination: {
        total,
        page: +page,
        limit: +limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<{ artist: Artist; artworks: Artwork[] }> {
    const artist = await this.artistModel.findById(id).populate('artworks');

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Get the artworks either from the populated artworks field or by querying
    let artworks = [];
    if (artist.artworks && artist.artworks.length > 0) {
      // If artworks are already populated, use them
      artworks = artist.artworks;
    } else {
      // Otherwise query for artworks by artistId
      artworks = await this.artworkModel.find({ artistId: artist._id });

      // Update the artist's artworks array if needed
      if (
        artworks.length > 0 &&
        (!artist.artworks || artist.artworks.length === 0)
      ) {
        await this.artistModel.updateOne(
          { _id: artist._id },
          { $set: { artworks: artworks.map((artwork) => artwork._id) } },
        );
      }
    }

    return { artist, artworks };
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistModel.findByIdAndUpdate(
      id,
      updateArtistDto,
      { new: true },
    );

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async remove(id: string): Promise<void> {
    const artist = await this.artistModel.findById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Find all artworks by this artist
    const artworks = await this.artworkModel.find({ artistId: artist._id });

    // If there are artworks, prevent deletion or handle them as appropriate
    // For example, you might want to delete all artworks or reassign them
    if (artworks.length > 0) {
      // Option 1: Prevent deletion if artworks exist
      // throw new BadRequestException('Cannot delete artist with existing artworks');

      // Option 2: Delete all artworks by this artist
      await this.artworkModel.deleteMany({ artistId: artist._id });
    }

    await this.artistModel.deleteOne({ _id: id });
  }

  async findFeatured(limit = 6): Promise<Artist[]> {
    return this.artistModel
      .find({ featured: true })
      .sort({ popularity: -1 })
      .limit(limit)
      .exec();
  }

  async getArtistsByArea(): Promise<AreaCount[]> {
    const artists = await this.artistModel.find({
      'location.area': { $exists: true },
    });

    // Group artists by area
    const areaMap = new Map<
      string,
      { count: number; lat?: number; lng?: number }
    >();

    artists.forEach((artist) => {
      if (artist.location && artist.location.area) {
        const area = artist.location.area;

        if (!areaMap.has(area)) {
          areaMap.set(area, {
            count: 1,
            lat: artist.location.lat,
            lng: artist.location.lng,
          });
        } else {
          const existing = areaMap.get(area);
          areaMap.set(area, {
            ...existing,
            count: existing.count + 1,
            // Only update coordinates if they exist
            ...(artist.location.lat && { lat: artist.location.lat }),
            ...(artist.location.lng && { lng: artist.location.lng }),
          });
        }
      }
    });

    // Convert map to array of area counts
    return Array.from(areaMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      location: {
        ...(data.lat && { lat: data.lat }),
        ...(data.lng && { lng: data.lng }),
      },
    }));
  }
}
