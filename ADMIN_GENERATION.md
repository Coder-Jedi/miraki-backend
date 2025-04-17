# Miraki Artistry Hub - Admin Credentials Generation

This document explains how to generate admin credentials for the Miraki Artistry Hub platform.

## Using the Admin Creation Script

The Miraki backend includes a dedicated script for creating admin users securely. This script creates a new user with admin privileges in the database.

### Prerequisites

- Make sure your MongoDB database is running and properly configured in your environment variables
- Ensure you have all dependencies installed with `npm install`

### Steps to Generate Admin Credentials

1. Navigate to your Miraki backend directory:
   ```bash
   cd /path/to/miraki-backend
   ```

2. Run the admin creation script:
   ```bash
   npm run create-admin
   ```

3. Follow the interactive prompts:
   - Enter a name for the admin user
   - Enter an email address (must be unique and valid)
   - Enter a secure password (minimum 8 characters)
   - Confirm the password

4. Upon successful completion, the script will display the admin credentials (except the password) and confirm that the admin account has been created.

### Example

```
$ npm run create-admin

> miraki-artistry-hub-backend@1.0.0 create-admin
> ts-node -r tsconfig-paths/register src/scripts/create-admin.ts

Starting Miraki Artistry Hub Admin User Creation
Initializing application...
✓ Application initialized successfully

[ Admin User Creation ]
Enter admin name: Admin User
Enter admin email: admin@miraki-art.com
Enter admin password (minimum 8 characters): ********
Confirm admin password: ********

Creating admin user...

✓ Admin user created successfully!

Admin Credentials:
Name: Admin User
Email: admin@miraki-art.com
Role: admin

You can now log in to the Miraki Artistry Hub admin panel using these credentials.
```

## Alternative Methods

### Manual Database Insertion

For advanced users or in emergency situations, you can create an admin user directly in the MongoDB database:

1. Connect to your MongoDB instance
2. Hash the password using bcrypt (you can use an online bcrypt generator for testing purposes)
3. Insert a new user document with the admin role

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@miraki-art.com",
  password: "$2b$10$hashedPasswordHere", // Generate this using bcrypt
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: new Date()
})
```

### Using the API (For System Administrators Only)

In production environments, admin users should only be created through secure channels. This method is NOT recommended for typical use:

1. You need an existing admin account or a system with elevated permissions
2. Make a POST request to `/auth/register` with role override permissions

## Security Considerations

- Always use strong, unique passwords for admin accounts
- Limit the number of admin users to only those who require full system access
- Regularly review and audit admin activities
- Consider implementing two-factor authentication for admin users
- Never share admin credentials or store them in insecure locations

## Troubleshooting

If you encounter issues when running the admin creation script:

1. **Database Connection Errors**: Verify your MongoDB connection string and ensure the database is running
2. **Module Resolution Errors**: Make sure all dependencies are installed and the project is built
3. **Permission Issues**: Ensure your MongoDB user has write permissions to the users collection
4. **Duplicate Email Errors**: Choose a different email address if you receive an error indicating the email is already in use

For further assistance, contact the system administrator or refer to the NestJS documentation.