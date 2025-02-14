import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { Role } from '../types/auth';
import {
  createLibrary,
  getLibrary,
  listLibraries,
  updateLibrary,
  deleteLibrary
} from '../controllers/libraryController';

const router = Router();

// Public routes
router.get('/', listLibraries);
router.get('/:id', getLibrary);
//router.get('/code/:code', libraryController.getLibraryByCode);

// Protected routes
router.post('/', authenticate, authorize([Role.ADMIN, Role.LIBRARIAN]), createLibrary);
router.put('/:id', authenticate, authorize([Role.ADMIN]), updateLibrary);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), deleteLibrary);
//router.patch('/libraries/:libraryid/status', authenticate, authorize([Role.ADMIN]), libraryController.toggleLibraryStatus);

export default router; 