import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Address } from './schemas/user.schema';
import {
  UpdateUserDto,
  CreateAddressDto,
  UpdateAddressDto,
} from './dto/user.dto';
import { Artwork } from '../artworks/schemas/artwork.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Address.name) private addressModel: Model<Address>,
    @InjectModel(Artwork.name) private artworkModel: Model<Artwork>,
  ) {}

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Address Management
  async getAddresses(userId: string): Promise<Address[]> {
    return this.addressModel.find({ userId });
  }

  async addAddress(
    userId: string,
    addressDto: CreateAddressDto,
  ): Promise<Address> {
    // If this is set as default, unset any existing default
    if (addressDto.isDefault) {
      await this.addressModel.updateMany(
        { userId, isDefault: true },
        { isDefault: false },
      );
    }

    const newAddress = new this.addressModel({
      ...addressDto,
      userId,
    });

    return newAddress.save();
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    // If setting as default, unset any existing default
    if (updateAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { userId, isDefault: true },
        { isDefault: false },
      );
    }

    const address = await this.addressModel.findOneAndUpdate(
      { _id: addressId, userId },
      updateAddressDto,
      { new: true },
    );

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const result = await this.addressModel.deleteOne({
      _id: addressId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Address not found');
    }
  }

  // Favorites Management
  async getFavorites(userId: string): Promise<Artwork[]> {
    const user = await this.userModel.findById(userId).populate('favorites');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.favorites as unknown as Artwork[];
  }

  async addToFavorites(userId: string, artworkId: string): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const artwork = await this.artworkModel.findById(artworkId);

    if (!artwork) {
      throw new NotFoundException('Artwork not found');
    }

    if (user.favorites && user.favorites.includes(artworkId)) {
      throw new ConflictException('Artwork already in favorites');
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favorites: artworkId },
    });

    // Also update the artwork's likedBy array and increment likes count
    await this.artworkModel.findByIdAndUpdate(artworkId, {
      $addToSet: { likedBy: userId },
      $inc: { likes: 1 },
    });
  }

  async removeFromFavorites(userId: string, artworkId: string): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.favorites || !user.favorites.includes(artworkId)) {
      throw new NotFoundException('Artwork not found in favorites');
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { favorites: artworkId },
    });

    // Also update the artwork's likedBy array and decrement likes count
    await this.artworkModel.findByIdAndUpdate(artworkId, {
      $pull: { likedBy: userId },
      $inc: { likes: -1 },
    });
  }
}
