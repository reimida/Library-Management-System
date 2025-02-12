import mongoose from 'mongoose';

const TEST_MONGODB_URI = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test_db';

let isConnected = false;

// Export these functions to be used in test files
export async function connect() {
  try {
    if (!isConnected) {
      await mongoose.connect(TEST_MONGODB_URI);
      isConnected = true;
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function clearDatabase() {
  if (!isConnected) return;
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

export async function closeDatabase() {
  if (!isConnected) return;
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  isConnected = false;
} 