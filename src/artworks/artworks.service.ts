import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artwork } from './schemas/artwork.schema';
import { Artist } from '../artists/schemas/artist.schema';
import {
  CreateArtworkDto,
  UpdateArtworkDto,
  ArtworkFilterDto,
} from './dto/artwork.dto';
import {
  ArtworkCategory,
  PaginationResult,
} from '../common/interfaces/common.interface';

@Injectable()
export class ArtworksService {
  constructor(
    @InjectModel(Artwork.name) private artworkModel: Model<Artwork>,
    @InjectModel(Artist.name) private artistModel: Model<Artist>,
  ) {}

  async create(createArtworkDto: CreateArtworkDto): Promise<Artwork> {
    // Find the artist to include their name in the artwork
    const artist = await this.artistModel.findById(createArtworkDto.artistId);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const newArtwork = new this.artworkModel({
      ...createArtworkDto,
      artist: artist.name, // Store the artist's name for display
      likes: 0,
      likedBy: [],
    });

    // Save the artwork first to generate an ID
    const savedArtwork = await newArtwork.save();

    // Add the artwork reference to the artist's artworks array
    await this.artistModel.updateOne(
      { _id: artist._id },
      { $push: { artworks: savedArtwork._id } }
    );

    return savedArtwork;
  }

  async findAll(
    filterDto: ArtworkFilterDto,
  ): Promise<PaginationResult<Artwork>> {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      location,
      featured,
      forSale,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      artistId,
    } = filterDto;

    const query = this.artworkModel.find();

    // Apply filters only when explicitly passed
    if (category && category !== ArtworkCategory.ALL) {
      query.where('category').equals(category);
    }

    if (minPrice !== undefined) {
      query.where('price').gte(minPrice);
    }

    if (maxPrice !== undefined && maxPrice > 0) {
      query.where('price').lte(maxPrice);
    }

    if (location) {
      query.where('location.area').equals(location);
    }

    // Only apply featured filter if it's explicitly included in the request
    if (featured !== undefined) {
      query.where('featured').equals(featured);
    }

    // Only apply forSale filter if it's explicitly included in the request
    if (forSale !== undefined) {
      query.where('forSale').equals(forSale);
    }

    if (artistId) {
      query.where('artistId').equals(artistId);
    }

    if (search) {
      query.where({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { artist: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    }

    // Apply sorting
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    query.sort({ [sortBy]: sortDirection });

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    // Execute query
    const artworks = await query.exec();
    const total = await this.artworkModel
      .countDocuments(query.getFilter())
      .exec();

    return {
      items: artworks,
      pagination: {
        total,
        page: +page,
        limit: +limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Artwork> {
    const artwork = await this.artworkModel.findById(id);

    if (!artwork) {
      throw new NotFoundException('Artwork not found');
    }

    return artwork;
  }

  async update(
    id: string,
    updateArtworkDto: UpdateArtworkDto,
  ): Promise<Artwork> {
    const artwork = await this.artworkModel.findById(id);
    
    if (!artwork) {
      throw new NotFoundException('Artwork not found');
    }
    
    // If artistId is updated, update the relations
    if (updateArtworkDto.artistId && updateArtworkDto.artistId !== artwork.artistId.toString()) {
      // Find the new artist
      const newArtist = await this.artistModel.findById(updateArtworkDto.artistId);

      if (!newArtist) {
        throw new NotFoundException('Artist not found');
      }

      // Remove artwork from old artist's artworks array
      await this.artistModel.updateOne(
        { _id: artwork.artistId },
        { $pull: { artworks: artwork._id } }
      );

      // Add artwork to new artist's artworks array
      await this.artistModel.updateOne(
        { _id: newArtist._id },
        { $push: { artworks: artwork._id } }
      );

      // Update the artist name in the artwork
      updateArtworkDto['artist'] = newArtist.name;
    }

    // Update the artwork
    const updatedArtwork = await this.artworkModel.findByIdAndUpdate(
      id,
      updateArtworkDto,
      { new: true },
    );

    return updatedArtwork;
  }

  async remove(id: string): Promise<void> {
    // Find the artwork to get the artistId
    const artwork = await this.artworkModel.findById(id);
    
    if (!artwork) {
      throw new NotFoundException('Artwork not found');
    }
    
    // Remove the artwork reference from the artist's artworks array
    await this.artistModel.updateOne(
      { _id: artwork.artistId },
      { $pull: { artworks: artwork._id } }
    );

    // Delete the artwork
    await this.artworkModel.deleteOne({ _id: id });
  }

  async findFeatured(limit = 6): Promise<Artwork[]> {
    return this.artworkModel
      .find({ featured: true })
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async toggleLike(
    artworkId: string,
    userId: string,
  ): Promise<{ liked: boolean; likesCount: number }> {
    const artwork = await this.artworkModel.findById(artworkId);

    if (!artwork) {
      throw new NotFoundException('Artwork not found');
    }

    // Check if user has already liked this artwork
    const userLiked = artwork.likedBy && artwork.likedBy.includes(userId);

    if (userLiked) {
      // Unlike: Remove user from likedBy array and decrement likes count
      await this.artworkModel.updateOne(
        { _id: artworkId },
        {
          $pull: { likedBy: userId },
          $inc: { likes: -1 },
        },
      );

      return {
        liked: false,
        likesCount: artwork.likes - 1,
      };
    } else {
      // Like: Add user to likedBy array and increment likes count
      await this.artworkModel.updateOne(
        { _id: artworkId },
        {
          $addToSet: { likedBy: userId },
          $inc: { likes: 1 },
        },
      );

      return {
        liked: true,
        likesCount: artwork.likes + 1,
      };
    }
  }

  async getCategories(): Promise<string[]> {
    return Object.values(ArtworkCategory);
  }

  async findRelated(artworkId: string, limit = 4): Promise<Artwork[]> {
    const artwork = await this.artworkModel.findById(artworkId);

    if (!artwork) {
      throw new NotFoundException('Artwork not found');
    }

    // Find related artworks based on category and artist, excluding the current one
    return this.artworkModel
      .find({
        $or: [{ category: artwork.category }, { artistId: artwork.artistId }],
        _id: { $ne: artworkId },
      })
      .limit(limit)
      .exec();
  }
}
