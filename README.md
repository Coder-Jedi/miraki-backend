# Miraki Backend

This is the backend for the Miraki Artistry Hub, a platform for artists and art enthusiasts.

## Features
- User authentication
- Artwork and artist management
- Favorites and cart functionality
- Admin dashboard with metrics

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd miraki-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and configure the environment variables:
   ```plaintext
   MONGO_URI=mongodb://localhost:27017/miraki
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. For development with live reload:
   ```bash
   npm run dev
   ```

## API Documentation
Refer to the [API Documentation](./API_DOC.md) for detailed information about the available endpoints.
