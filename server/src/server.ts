import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 