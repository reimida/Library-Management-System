import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Library Seats Booking API' });
});

// Routes
app.use("/users", userRoutes);

export default app; 