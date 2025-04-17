import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Define the enum for user roles (copied from the project to avoid dependencies)
enum UserRole {
  ADMIN = 'admin',
  ARTIST = 'artist',
  USER = 'user',
}

// Create readline interface for command-line interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify readline question method
const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function isStrongPassword(password: string): boolean {
  return password.length >= 8;
}

// Define User schema directly in the script to avoid dependencies
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    lastLogin: { type: Date, default: Date.now },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

async function bootstrap() {
  console.log('\n=== Miraki Artistry Hub - Admin User Creation ===\n');

  try {
    // Get database connection string
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('No MongoDB URI found in environment variables.');
      mongoUri = await question('Please enter MongoDB connection string: ');
    } else {
      console.log('Using MongoDB URI from environment variables.');
    }

    // Connect to MongoDB
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB successfully');

    // Register the User model
    const User = mongoose.model('User', UserSchema);

    console.log('\n[ Admin User Creation ]');

    // Collect admin user information
    const name = await question('Enter admin name: ');

    let email: string;
    let isEmailValid = false;
    do {
      email = await question('Enter admin email: ');
      isEmailValid = isValidEmail(email);
      if (!isEmailValid) {
        console.error('Invalid email format. Please try again.');
      } else {
        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.error(
            'This email is already registered. Please use a different email.',
          );
          isEmailValid = false;
        }
      }
    } while (!isEmailValid);

    let password: string;
    let isPasswordValid = false;
    do {
      password = await question(
        'Enter admin password (minimum 8 characters): ',
      );
      isPasswordValid = isStrongPassword(password);
      if (!isPasswordValid) {
        console.error(
          'Password must be at least 8 characters long. Please try again.',
        );
      }
    } while (!isPasswordValid);

    const confirmPassword = await question('Confirm admin password: ');
    if (password !== confirmPassword) {
      console.error('Passwords do not match. Aborting.');
      await mongoose.disconnect();
      rl.close();
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('\nCreating admin user...');

    // Create the admin user
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    await adminUser.save();

    console.log('\n✓ Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Role: ${UserRole.ADMIN}`);
    console.log(
      '\nYou can now log in to the Miraki Artistry Hub admin panel using these credentials.\n',
    );

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error(`Failed to create admin user: ${error.message}`);
    console.error(error.stack);
  } finally {
    rl.close();
  }
}

bootstrap();
