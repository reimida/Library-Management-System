import request from 'supertest';
import app from '../src/app';
import { generateToken } from '../src/utils/jwtUtils';
import Library from '../src/models/Library';
import { Role } from '../src/types/auth';
import { connect, clearDatabase, closeDatabase } from './setup';

// Ensure JWT_SECRET is set for tests
process.env.JWT_SECRET = 'test-secret';

describe('Library API', () => {
  // Test tokens with explicit secret
  const adminToken = generateToken({ 
    userId: '1', 
    email: 'admin@test.com', 
    role: Role.ADMIN 
  });
  
  const librarianToken = generateToken({ 
    userId: '2', 
    email: 'librarian@test.com', 
    role: Role.LIBRARIAN 
  });
  
  const userToken = generateToken({ 
    userId: '3', 
    email: 'user@test.com', 
    role: Role.USER 
  });

  const testLibrary = {
    name: 'Test Library',
    libraryCode: 'TEST001',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country'
    },
    operatingHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' }
    },
    contactPhone: '+1234567890',
    contactEmail: 'test@library.com',
    totalSeats: 100
  };

  beforeAll(async () => await connect());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  describe('POST /libraries', () => {
    it('should allow admin to create library', async () => {
      const response = await request(app)
        .post('/libraries')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testLibrary);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(testLibrary.name);
    });

    it('should allow librarian to create library', async () => {
      const response = await request(app)
        .post('/libraries')
        .set('Authorization', `Bearer ${librarianToken}`)
        .send(testLibrary);

      expect(response.status).toBe(201);
    });

    it('should not allow regular user to create library', async () => {
      const response = await request(app)
        .post('/libraries')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testLibrary);

      expect(response.status).toBe(403);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/libraries')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /libraries', () => {
    beforeEach(async () => {
      await Library.create(testLibrary);
    });

    it('should list all libraries without authentication', async () => {
      const response = await request(app)
        .get('/libraries');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    it('should filter inactive libraries by default', async () => {
      await Library.create({ ...testLibrary, libraryCode: 'TEST002', isActive: false });
      
      const response = await request(app)
        .get('/libraries');

      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('PUT /libraries/:id', () => {
    let libraryId: string;

    beforeEach(async () => {
      const library = await Library.create(testLibrary);
      libraryId = library._id.toString();
    });

    it('should allow admin to update library', async () => {
      const response = await request(app)
        .put(`/libraries/${libraryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Library' });
      
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated Library');
    });

    it('should not allow regular user to update library', async () => {
      const response = await request(app)
        .put(`/libraries/${libraryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Library' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /libraries/:id', () => {
    let libraryId: string;

    beforeEach(async () => {
      const library = await Library.create(testLibrary);
      libraryId = library._id.toString();
    });

    it('should allow only admin to delete library', async () => {
      const response = await request(app)
        .delete(`/libraries/${libraryId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
    });

    it('should not allow librarian to delete library', async () => {
      const response = await request(app)
        .delete(`/libraries/${libraryId}`)
        .set('Authorization', `Bearer ${librarianToken}`);

      expect(response.status).toBe(403);
    });
  });
}); 