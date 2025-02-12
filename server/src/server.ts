import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;

// Only connect if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 