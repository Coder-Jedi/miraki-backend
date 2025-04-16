import { 
  Controller, 
  Get, 
  Put, 
  Post, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserDto, AddressDto, UpdateAddressDto } from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      success: true,
      data: user,
    };
  }

  @Put('me')
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(userId, updateUserDto);
    return {
      success: true,
      data: user,
    };
  }

  // Favorites management
  @Get('me/favorites')
  async getFavorites(@CurrentUser('userId') userId: string) {
    const favorites = await this.usersService.getFavorites(userId);
    return {
      success: true,
      data: {
        favorites,
        count: favorites.length,
      },
    };
  }

  @Post('me/favorites/:artworkId')
  @HttpCode(HttpStatus.OK)
  async addToFavorites(
    @CurrentUser('userId') userId: string,
    @Param('artworkId') artworkId: string,
  ) {
    await this.usersService.addToFavorites(userId, artworkId);
    return {
      success: true,
      message: 'Artwork added to favorites',
    };
  }

  @Delete('me/favorites/:artworkId')
  async removeFromFavorites(
    @CurrentUser('userId') userId: string,
    @Param('artworkId') artworkId: string,
  ) {
    await this.usersService.removeFromFavorites(userId, artworkId);
    return {
      success: true,
      message: 'Artwork removed from favorites',
    };
  }

  // Address management
  @Get('me/addresses')
  async getAddresses(@CurrentUser('userId') userId: string) {
    const addresses = await this.usersService.getAddresses(userId);
    return {
      success: true,
      data: {
        addresses,
      },
    };
  }

  @Post('me/addresses')
  async addAddress(
    @CurrentUser('userId') userId: string,
    @Body() addressDto: AddressDto,
  ) {
    const address = await this.usersService.addAddress(userId, addressDto);
    return {
      success: true,
      data: address,
    };
  }

  @Put('me/addresses/:addressId')
  async updateAddress(
    @CurrentUser('userId') userId: string,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.usersService.updateAddress(userId, addressId, updateAddressDto);
    return {
      success: true,
      data: address,
    };
  }

  @Delete('me/addresses/:addressId')
  async deleteAddress(
    @CurrentUser('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    await this.usersService.deleteAddress(userId, addressId);
    return {
      success: true,
      message: 'Address deleted successfully',
    };
  }
}