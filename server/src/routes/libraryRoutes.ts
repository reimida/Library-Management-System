import express from 'express';
import * as libraryController from '../controllers/libraryController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { Role } from '../types/auth';

const router = express.Router();

// Public routes
router.get('/', libraryController.listLibraries);
router.get('/:id', libraryController.getLibrary);
router.get('/code/:code', libraryController.getLibraryByCode);

// Protected routes
router.post('/', authenticate, authorize([Role.ADMIN, Role.LIBRARIAN]), libraryController.createLibrary);
router.put('/:id', authenticate, authorize([Role.ADMIN, Role.LIBRARIAN]), libraryController.updateLibrary);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), libraryController.deleteLibrary);
router.patch('/:id/status', authenticate, authorize([Role.ADMIN]), libraryController.toggleLibraryStatus);

export default router; 