import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import libraryRoutes from './routes/libraryRoutes';
import seatRoutes from './routes/seatRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Library Seats Booking API' });
});

// Routes
app.use("/users", userRoutes);
app.use('/libraries', libraryRoutes);
app.use('/seats', seatRoutes);

export default app; 