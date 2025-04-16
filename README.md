# Miraki Artistry Hub Backend

This is the backend API for the Miraki Artistry Hub platform, a marketplace connecting artists with art enthusiasts in Mumbai.

## Features

- Authentication system with JWT
- User profiles with address management
- Artworks catalog with search, filtering, and favorites
- Artists profiles and area-based browsing
- Shopping cart functionality
- Order processing and management
- Role-based access control

## Tech Stack

- Node.js
- NestJS framework
- MongoDB with Mongoose
- JWT authentication
- TypeScript
- RESTful API design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your environment variables:
   ```
   cp .env.example .env
   ```
4. Update the MongoDB connection URI in the `.env` file

### Running the Application

#### Development mode
```
npm run start:dev
```

#### Production mode
```
npm run build
npm run start:prod
```

## API Documentation

The API is organized around REST principles. All endpoints return JSON and use standard HTTP response codes.

Base URL: `/api/v1`

### Authentication Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate a user
- `POST /auth/logout` - Log out the current user
- `POST /auth/reset-password` - Request a password reset
- `POST /auth/reset-password/confirm` - Complete password reset

### User Endpoints

- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `GET /users/me/favorites` - Get favorite artworks
- `POST /users/me/favorites/:artworkId` - Add to favorites
- `DELETE /users/me/favorites/:artworkId` - Remove from favorites
- `GET /users/me/addresses` - Get user addresses
- `POST /users/me/addresses` - Add new address
- `PUT /users/me/addresses/:addressId` - Update address
- `DELETE /users/me/addresses/:addressId` - Delete address

### Artwork Endpoints

- `GET /artworks` - List artworks with filters
- `GET /artworks/:id` - Get artwork details
- `GET /artworks/featured` - Get featured artworks
- `POST /artworks/:id/like` - Toggle artwork like
- `GET /artworks/categories` - Get artwork categories

### Artist Endpoints

- `GET /artists` - List artists
- `GET /artists/:id` - Get artist details
- `GET /artists/featured` - Get featured artists
- `GET /artists/by-area` - Get artists by area

### Cart Endpoints

- `GET /cart` - Get current cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:itemId` - Update cart item
- `DELETE /cart/items/:itemId` - Remove item from cart
- `DELETE /cart` - Clear cart

### Order Endpoints

- `POST /orders` - Create order
- `GET /orders` - List user orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status (admin)
- `PUT /orders/:id/payment` - Update payment status (admin)

## License

MIT
