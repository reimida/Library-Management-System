import { Router } from "express";
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  assignLibrarian,
  removeLibrarian
} from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { Role } from "../types/auth";
import { userReservationRouter } from "./reservationRoutes";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
//router.post("/logout", logout);
// Protected routes
router.get("/profile", authenticate, getProfile);
router.patch("/profile", authenticate, updateProfile); // Using PATCH since it's partial update

// Admin routes for managing librarians
router.post(
  '/:userId/librarian',
  authenticate,
  authorize([Role.ADMIN]),
  assignLibrarian
);

router.delete(
  '/:userId/librarian',
  authenticate,
  authorize([Role.ADMIN]),
  removeLibrarian
);

// Mount user reservation routes
router.use('/', userReservationRouter);

export default router; 