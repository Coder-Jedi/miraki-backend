import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../users/schemas/user.schema';
import { RegisterDto, LoginDto, ResetPasswordRequestDto, ResetPasswordDto, ChangePasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: any; token: string }> {
    const { name, email, password } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    
    const savedUser = await user.save();
    
    // Generate JWT token
    const token = this.generateToken(savedUser);
    
    // Return user data without password and token
    const userData = savedUser.toObject();
    delete userData.password;
    
    return {
      user: userData,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: any; token: string }> {
    const { email, password } = loginDto;
    
    // Find user by email with password included
    const user = await this.userModel.findOne({ email }).select('+password');
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = this.generateToken(user);
    
    // Return user data without password and token
    const userData = user.toObject();
    delete userData.password;
    
    return {
      user: userData,
      token,
    };
  }

  async resetPasswordRequest(resetPasswordRequestDto: ResetPasswordRequestDto): Promise<void> {
    const { email } = resetPasswordRequestDto;
    
    // Find user by email
    const user = await this.userModel.findOne({ email });
    
    if (!user) {
      // Don't reveal if email exists for security reasons
      return;
    }
    
    // Generate reset token
    const token = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
    
    // Save token to user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();
    
    // In a real implementation, send an email with the reset link
    console.log(`Password reset link: /reset-password?token=${token}`);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;
    
    // Find user by token
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;
    
    // Find user by ID with password included
    const user = await this.userModel.findById(userId).select('+password');
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    user.password = hashedPassword;
    await user.save();
  }

  private generateToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };
    
    return this.jwtService.sign(payload);
  }
}