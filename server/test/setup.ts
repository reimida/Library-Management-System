import mongoose from 'mongoose';

const TEST_MONGODB_URI = 'mongodb://localhost:27018/test_db';

// Export these functions to be used in test files
export async function connect() {
  try {
    await mongoose.connect(TEST_MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

export async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
} 