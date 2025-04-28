export enum UserRole {
  ADMIN = 'admin',
  ARTIST = 'artist',
  USER = 'user',
}

export enum ArtworkCategory {
  ALL = 'All',
  PAINTING = 'Painting',
  SCULPTURE = 'Sculpture',
  PHOTOGRAPHY = 'Photography',
  DIGITAL = 'Digital',
  DIGITAL_ART = 'Digital Art',
  MIXED_MEDIA = 'Mixed Media',
  CERAMICS = 'Ceramics',
  ILLUSTRATION = 'Illustration',
  OTHER = 'Other',
}

export enum Area {
  BANDRA = 'Bandra',
  KALA_GHODA = 'Kala Ghoda',
  COLABA = 'Colaba',
  WORLI = 'Worli',
  FORT = 'Fort',
  JUHU = 'Juhu',
  ANDHERI = 'Andheri',
  POWAI = 'Powai',
  DADAR = 'Dadar',
  LOWER_PAREL = 'Lower Parel',
  SANTACRUZ = 'Santacruz',
  CHEMBUR = 'Chembur',
  VERSOVA = 'Versova',
  OTHER = 'Other',
}

export enum AddressType {
  HOME = 'home',
  OFFICE = 'office',
  OTHER = 'other',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CARD = 'card',
  NETBANKING = 'netbanking',
  UPI = 'upi',
  COD = 'cod', // Cash on Delivery
}

export interface Location {
  lat?: number;
  lng?: number;
  area: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginationResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface SocialLinks {
  website?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}