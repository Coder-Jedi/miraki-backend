# API Documentation

This document outlines the APIs required to power the Miraki Artistry Hub client web app. The APIs are divided into two sections: **Client APIs** and **Admin APIs**.

---

## Client APIs

### 1. Authentication

#### **POST /api/auth/login**
- **Description**: Logs in a user.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string"
    }
  }
  ```

#### **POST /api/auth/register**
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
  ```

#### **POST /api/auth/logout**
- **Description**: Logs out the current user.
- **Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

### 2. Artworks

#### **GET /api/artworks**
- **Description**: Fetches a list of artworks with optional filters.
- **Query Parameters**:
  - `category` (optional): Filter by category.
  - `searchQuery` (optional): Search by title, artist, or description.
  - `location` (optional): Filter by location.
  - `priceRange` (optional): Filter by price range (e.g., `0-5000`).
  - `sortBy` (optional): Sort by `newest`, `oldest`, `priceAsc`, `priceDesc`, or `popular`.
  - `page` (optional): Pagination page number.
- **Response**:
  ```json
  {
    "artworks": [
      {
        "id": "string",
        "title": "string",
        "artist": "string",
        "description": "string",
        "category": "string",
        "image": "string",
        "price": "number",
        "forSale": "boolean",
        "location": {
          "lat": "number",
          "lng": "number",
          "address": "string",
          "area": "string"
        },
        "createdAt": "string",
        "medium": "string",
        "dimensions": "string",
        "year": "number"
      }
    ],
    "totalPages": "number",
    "currentPage": "number"
  }
  ```

#### **GET /api/artworks/:id**
- **Description**: Fetches details of a specific artwork.
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "artist": "string",
    "description": "string",
    "category": "string",
    "image": "string",
    "price": "number",
    "forSale": "boolean",
    "location": {
      "lat": "number",
      "lng": "number",
      "address": "string",
      "area": "string"
    },
    "createdAt": "string",
    "medium": "string",
    "dimensions": "string",
    "year": "number"
  }
  ```

---

### 3. Artists

#### **GET /api/artists**
- **Description**: Fetches a list of artists.
- **Query Parameters**:
  - `name` (optional): Filter by artist name.
- **Response**:
  ```json
  {
    "artists": [
      {
        "id": "string",
        "name": "string",
        "bio": "string",
        "location": {
          "lat": "number",
          "lng": "number",
          "address": "string",
          "area": "string"
        },
        "profileImage": "string",
        "socialLinks": {
          "website": "string",
          "instagram": "string"
        }
      }
    ]
  }
  ```

#### **GET /api/artists/:id**
- **Description**: Fetches details of a specific artist.
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "bio": "string",
    "location": {
      "lat": "number",
      "lng": "number",
      "address": "string",
      "area": "string"
    },
    "profileImage": "string",
    "socialLinks": {
      "website": "string",
      "instagram": "string"
    },
    "artworks": [
      {
        "id": "string",
        "title": "string",
        "image": "string"
      }
    ]
  }
  ```

---

### 4. Favorites

#### **GET /api/favorites**
- **Description**: Fetches the user's favorite artworks.
- **Response**:
  ```json
  {
    "favorites": [
      {
        "id": "string",
        "title": "string",
        "artist": "string",
        "image": "string"
      }
    ]
  }
  ```

#### **POST /api/favorites**
- **Description**: Adds an artwork to the user's favorites.
- **Request Body**:
  ```json
  {
    "artworkId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Artwork added to favorites"
  }
  ```

#### **DELETE /api/favorites/:id**
- **Description**: Removes an artwork from the user's favorites.
- **Response**:
  ```json
  {
    "message": "Artwork removed from favorites"
  }
  ```

---

### 5. Cart

#### **GET /api/cart**
- **Description**: Fetches the user's cart items.
- **Response**:
  ```json
  {
    "cart": [
      {
        "id": "string",
        "title": "string",
        "artist": "string",
        "price": "number",
        "quantity": "number"
      }
    ],
    "total": "number"
  }
  ```

#### **POST /api/cart**
- **Description**: Adds an artwork to the user's cart.
- **Request Body**:
  ```json
  {
    "artworkId": "string",
    "quantity": "number"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Artwork added to cart"
  }
  ```

#### **DELETE /api/cart/:id**
- **Description**: Removes an artwork from the user's cart.
- **Response**:
  ```json
  {
    "message": "Artwork removed from cart"
  }
  ```

---

## Admin APIs

### 1. Manage Artworks

#### **POST /api/admin/artworks**
- **Description**: Adds a new artwork.
- **Request Body**:
  ```json
  {
    "title": "string",
    "artist": "string",
    "description": "string",
    "category": "string",
    "image": "string",
    "price": "number",
    "forSale": "boolean",
    "location": {
      "lat": "number",
      "lng": "number",
      "address": "string",
      "area": "string"
    },
    "medium": "string",
    "dimensions": "string",
    "year": "number"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Artwork added successfully",
    "artwork": {
      "id": "string",
      "title": "string"
    }
  }
  ```

#### **PUT /api/admin/artworks/:id**
- **Description**: Updates an existing artwork.
- **Request Body**:
  ```json
  {
    "title": "string",
    "artist": "string",
    "description": "string",
    "category": "string",
    "image": "string",
    "price": "number",
    "forSale": "boolean",
    "location": {
      "lat": "number",
      "lng": "number",
      "address": "string",
      "area": "string"
    },
    "medium": "string",
    "dimensions": "string",
    "year": "number"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Artwork updated successfully"
  }
  ```

#### **DELETE /api/admin/artworks/:id**
- **Description**: Deletes an artwork.
- **Response**:
  ```json
  {
    "message": "Artwork deleted successfully"
  }
  ```

---

### 2. Manage Artists

#### **POST /api/admin/artists**
- **Description**: Adds a new artist.
- **Request Body**:
  ```json
  {
    "name": "string",
    "bio": "string",
    "location": {
      "lat": "number",
      "lng": "number",
      "address": "string",
      "area": "string"
    },
    "profileImage": "string",
    "socialLinks": {
      "website": "string",
      "instagram": "string"
    }
  }
  ```
- **Response**:
  ```json
  {
    "message": "Artist added successfully",
    "artist": {
      "id": "string",
      "name": "string"
    }
  }
  ```

#### **PUT /api/admin/artists/:id**
- **Description**: Updates an existing artist.
- **Request Body**:
  ```json
  {
    "name": "string",
    "bio": "string",
    "location": {
      "lat": "number",
      "lng": "number",
      "address": "string",
      "area": "string"
    },
    "profileImage": "string",
    "socialLinks": {
      "website": "string",
      "instagram": "string"
    }
  }
  ```
- **Response**:
  ```json
  {
    "message": "Artist updated successfully"
  }
  ```

#### **DELETE /api/admin/artists/:id**
- **Description**: Deletes an artist.
- **Response**:
  ```json
  {
    "message": "Artist deleted successfully"
  }
  ```

---

### 3. Dashboard Metrics

#### **GET /api/admin/metrics**
- **Description**: Fetches metrics for the admin dashboard.
- **Response**:
  ```json
  {
    "totalArtworks": "number",
    "totalArtists": "number",
    "totalUsers": "number",
    "totalSales": "number"
  }
  ```
