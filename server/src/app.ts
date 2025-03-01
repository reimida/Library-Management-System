import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import libraryRoutes from './routes/libraryRoutes';
import seatRoutes from './routes/seatRoutes';
import { userReservationRouter } from './routes/reservationRoutes';
import { setupSwagger } from './config/swagger-ui';

const app = express();

app.use(cors());
app.use(express.json());

// Set up Swagger UI
setupSwagger(app);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Library Seats Booking API' });
});

// Routes
app.use("/users", userRoutes);
app.use('/libraries', libraryRoutes);
app.use('/seats', seatRoutes);
app.use('/reservations', userReservationRouter);
// Schedule routes are handled within library routes

export default app; 