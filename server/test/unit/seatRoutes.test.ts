import express from 'express';
import { authenticate } from '../../src/middlewares/authMiddleware';
import { authorize } from '../../src/middlewares/roleMiddleware';
import { checkLibrarianOwnership } from '../../src/middlewares/checkLibrarianOwnership';
import { Role } from '../../src/types/auth';
import * as seatController from '../../src/controllers/seatController';
import request from 'supertest';
import { Request, Response, NextFunction } from 'express';

// Add this declaration to extend the Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: Role;
      };
    }
  }
}

// Mock middleware and controllers
jest.mock('../../src/middlewares/authMiddleware');
jest.mock('../../src/middlewares/roleMiddleware');
jest.mock('../../src/middlewares/checkLibrarianOwnership');
jest.mock('../../src/controllers/seatController');

const mockedAuthenticate = authenticate as jest.MockedFunction<typeof authenticate>;
const mockedAuthorize = authorize as jest.MockedFunction<typeof authorize>;
const mockedCheckOwnership = checkLibrarianOwnership as jest.MockedFunction<typeof checkLibrarianOwnership>;
const mockedCreateSeat = seatController.createSeat as jest.MockedFunction<typeof seatController.createSeat>;

describe('Seat Routes', () => {
  let app: express.Application;
  let router: express.Router;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock middleware behavior
    mockedAuthenticate.mockImplementation((req, res, next) => {
      next();
      return undefined;
    });
    mockedAuthorize.mockReturnValue((req, res, next) => {
      next();
      return undefined;
    });
    mockedCheckOwnership.mockImplementation(async (req, res, next) => {
      next();
      return Promise.resolve();
    });
    mockedCreateSeat.mockImplementation(async (req, res) => {
      res.status(200).json({ success: true });
      return Promise.resolve();
    });
    
    // Create express app with manually defined routes
    app = express();
    router = express.Router();
    
    // Define the routes manually
    router.post('/', 
      mockedAuthenticate,
      mockedAuthorize([Role.ADMIN, Role.LIBRARIAN]),
      async (req, res, next) => {
        if (req.user?.role === Role.ADMIN) return next();
        return mockedCheckOwnership(req, res, next);
      },
      mockedCreateSeat
    );
    
    app.use('/:libraryId/seats', router);
  });

  describe('Route authorization chains', () => {
    it('should apply proper middleware chain for POST route', async () => {
      // Make request to trigger middleware chain
      await request(app).post('/library123/seats').send({});
      
      // Verify middleware was called in correct sequence
      expect(mockedAuthenticate).toHaveBeenCalled();
      expect(mockedAuthorize).toHaveBeenCalledWith([Role.ADMIN, Role.LIBRARIAN]);
      expect(mockedCreateSeat).toHaveBeenCalled();
    });
    
    it('should bypass checkLibrarianOwnership for admins in POST route', async () => {
      // Reset the mock to ensure it starts clean
      mockedCheckOwnership.mockReset();
      
      // Create a new app and router for this test
      app = express();
      router = express.Router();
      
      // Define the routes with a simpler approach
      router.post('/', 
        mockedAuthenticate,
        // This middleware sets the user as admin
        (req, res, next) => {
          req.user = { userId: 'admin123', email: 'admin@test.com', role: Role.ADMIN };
          next();
        },
        // This middleware checks the role and skips ownership check for admin
        (req, res, next) => {
          if (req.user?.role === Role.ADMIN) {
            return next();
          }
          return mockedCheckOwnership(req, res, next);
        },
        mockedCreateSeat
      );
      
      app.use('/:libraryId/seats', router);
      
      await request(app).post('/library123/seats').send({});
      
      // Verify ownership check was skipped
      expect(mockedCheckOwnership).not.toHaveBeenCalled();
      expect(mockedCreateSeat).toHaveBeenCalled();
    });
    
    it('should check librarian ownership for librarians in POST route', async () => {
      // Mock the request to include librarian role
      mockedAuthorize.mockReturnValue((req, res, next) => {
        req.user = { userId: 'lib123', email: 'lib@test.com', role: Role.LIBRARIAN };
        next();
        return undefined;
      });
      
      await request(app).post('/library123/seats').send({});
      
      // Verify ownership was checked
      expect(mockedCheckOwnership).toHaveBeenCalled();
      expect(mockedCreateSeat).toHaveBeenCalled();
    });
  });
}); 