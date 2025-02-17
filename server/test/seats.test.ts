import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { generateToken } from '../src/utils/jwtUtils';
import { Role } from '../src/types/auth';
import { connect, clearDatabase, closeDatabase } from './setup';
import User from '../src/models/User';
import Library from '../src/models/Library';
import { createTestLibraryData } from './testUtils';
import { SeatStatus } from '../src/validations/seatSchemas';
import { z } from 'zod';
import { seatSchema } from '../src/validations/seatSchemas';

// Add type for seat response
type SeatResponse = z.infer<typeof seatSchema> & { _id: string; libraryId: string };

describe('Seats API', () => {
  let adminToken: string;
  let librarianToken: string;
  let userToken: string;
  let libraryId: string;
  let librarianId: mongoose.Types.ObjectId;
  let otherLibraryId: string;
  let seatId: string;

  const testSeat = {
    code: 'A101',
    floor: '1st',
    area: 'Main Hall',
    status: SeatStatus.AVAILABLE
  } satisfies z.infer<typeof seatSchema>;

  beforeAll(async () => await connect());

  beforeEach(async () => {
    // Create users with different roles
    const admin = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: Role.ADMIN
    });

    const librarian = await User.create({
      name: 'Test Librarian',
      email: 'librarian@test.com',
      password: 'password123',
      role: Role.LIBRARIAN
    });
    librarianId = librarian._id;

    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      role: Role.USER
    });

    // Generate tokens
    adminToken = generateToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: Role.ADMIN
    });

    librarianToken = generateToken({
      userId: librarian._id.toString(),
      email: librarian.email,
      role: Role.LIBRARIAN
    });

    userToken = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: Role.USER
    });

    // Create test libraries
    const library = await Library.create({
      ...createTestLibraryData(),
      libraryCode: 'TEST001',
      librarians: [librarianId]
    });
    libraryId = library._id.toString();

    const otherLibrary = await Library.create({
      ...createTestLibraryData(),
      libraryCode: 'TEST002'
    });
    otherLibraryId = otherLibrary._id.toString();
  });

  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  describe('POST /libraries/:libraryId/seats', () => {
    it('should allow admin to create seat', async () => {
      const response = await request(app)
        .post(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testSeat);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.code).toBe(testSeat.code);
      expect(response.body.data.floor).toBe(testSeat.floor);
      expect(response.body.data.area).toBe(testSeat.area);
      expect(response.body.data.status).toBe(testSeat.status);
      expect(response.body.data.libraryId).toBe(libraryId);
    });

    it('should allow librarian to create seat in assigned library', async () => {
      const response = await request(app)
        .post(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${librarianToken}`)
        .send(testSeat);

      expect(response.status).toBe(201);
    });

    it('should not allow librarian to create seat in unassigned library', async () => {
      const response = await request(app)
        .post(`/libraries/${otherLibraryId}/seats`)
        .set('Authorization', `Bearer ${librarianToken}`)
        .send(testSeat);

      expect(response.status).toBe(403);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      const validationResult = await seatSchema.safeParseAsync({});
      if (!validationResult.success) {
        const expectedErrors = validationResult.error.errors.map(err => err.message);
        expect(response.body.errors).toEqual(expect.arrayContaining(expectedErrors));
      }
    });

    it('should prevent duplicate seat codes within same library', async () => {
      // First create a seat
      await request(app)
        .post(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testSeat);

      // Try to create another seat with the same code
      const response = await request(app)
        .post(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testSeat);

      expect(response.status).toBe(409);
      expect(response.body.errors).toContain('Seat code already exists in this library');
    });
  });

  describe('GET /libraries/:libraryId/seats', () => {
    beforeEach(async () => {
      // Setup: Create test seats
      await request(app)
        .post(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testSeat,
          code: 'A102'
        });

      await request(app)
        .post(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testSeat,
          code: 'A103',
          floor: '2nd'
        });
    });

    it('should list all seats in library', async () => {
      const response = await request(app)
        .get(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      const seats = response.body.data;
      expect(Array.isArray(seats)).toBe(true);
      expect(seats.length).toBe(2);
      seats.forEach((seat: SeatResponse) => {
        expect(seatSchema.safeParse(seat).success).toBe(true);
      });
    });

    it('should filter seats by status', async () => {
      const response = await request(app)
        .get(`/libraries/${libraryId}/seats`)
        .query({ status: SeatStatus.AVAILABLE })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      const seats = response.body.data;
      expect(Array.isArray(seats)).toBe(true);
      seats.forEach((seat: SeatResponse) => {
        expect(seat.status).toBe(SeatStatus.AVAILABLE);
      });
    });

    it('should filter seats by floor', async () => {
      const response = await request(app)
        .get(`/libraries/${libraryId}/seats`)
        .query({ floor: '1st' })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      const seats = response.body.data;
      expect(seats.every((seat: SeatResponse) => seat.floor === '1st')).toBe(true);
    });
  });

  describe('PATCH /libraries/:libraryId/seats/:seatId', () => {
    let createdSeat: SeatResponse;

    beforeEach(async () => {
      const response = await request(app)
        .post(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testSeat,
          code: 'A104'
        });

      createdSeat = response.body.data;
      seatId = createdSeat._id;
    });

    it('should allow admin to update seat', async () => {
      const updateData = {
        status: SeatStatus.OUT_OF_SERVICE,
        area: 'Updated Area'
      };

      const response = await request(app)
        .patch(`/libraries/${libraryId}/seats/${seatId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      const updatedSeat = response.body.data;
      expect(updatedSeat.status).toBe(updateData.status);
      expect(updatedSeat.area).toBe(updateData.area);
      expect(seatSchema.safeParse(updatedSeat).success).toBe(true);
    });

    it('should allow librarian to update seat in assigned library', async () => {
      const response = await request(app)
        .patch(`/libraries/${libraryId}/seats/${seatId}`)
        .set('Authorization', `Bearer ${librarianToken}`)
        .send({ area: 'Updated Area' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.area).toBe('Updated Area');
    });

    it('should not allow regular user to update seat', async () => {
      const response = await request(app)
        .patch(`/libraries/${libraryId}/seats/${seatId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: SeatStatus.OUT_OF_SERVICE });

      expect(response.status).toBe(403);
    });

    it('should validate update fields', async () => {
      const response = await request(app)
        .patch(`/libraries/${libraryId}/seats/${seatId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /libraries/:libraryId/seats/:seatId', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post(`/libraries/${libraryId}/seats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testSeat,
          code: 'A105'
        });

      seatId = response.body.data._id;
    });

    it('should allow admin to delete seat', async () => {
      const response = await request(app)
        .delete(`/libraries/${libraryId}/seats/${seatId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
    });

    it('should not allow librarian to delete seat from unassigned library', async () => {
      const response = await request(app)
        .delete(`/libraries/${otherLibraryId}/seats/${seatId}`)
        .set('Authorization', `Bearer ${librarianToken}`);

      expect(response.status).toBe(403);
    });
  });
}); 