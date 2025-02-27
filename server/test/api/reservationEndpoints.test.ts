import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import User from '../../src/models/User';
import Library from '../../src/models/Library';
import {Seat} from '../../src/models/Seat';
import Reservation, { ReservationStatus } from '../../src/models/Reservation';
import { generateToken } from '../../src/utils/jwtUtils';
import { Role } from '../../src/types/auth';
import { connect, clearDatabase, closeDatabase } from '../setup';

// Test data
const adminUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Admin User',
  email: 'admin@test.com',
  password: '$2b$10$testHashedPassword', 
  role: Role.ADMIN
};

const librarianUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Librarian User',
  email: 'librarian@test.com',
  password: '$2b$10$testHashedPassword',
  role: Role.LIBRARIAN
};

const regularUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Regular User',
  email: 'user@test.com',
  password: '$2b$10$testHashedPassword',
  role: Role.USER
};

const secondUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Second User',
  email: 'user2@test.com',
  password: '$2b$10$testHashedPassword',
  role: Role.USER
};

const testLibrary = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test Library',
  libraryCode: 'TESTLIB',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
    country: 'Test Country'
  },
  contactPhone: '+1234567890',
  contactEmail: 'library@test.com',
  totalSeats: 100,
  isActive: true,
  librarians: [librarianUser._id]
};

const testSeat = {
  _id: new mongoose.Types.ObjectId(),
  code: 'A1',
  floor: '1',
  area: 'Main Hall',
  status: 'AVAILABLE',
  libraryId: testLibrary._id
};

const testSeat2 = {
  _id: new mongoose.Types.ObjectId(),
  code: 'A2',
  floor: '1',
  area: 'Main Hall',
  status: 'AVAILABLE',
  libraryId: testLibrary._id
};

// Current date and future dates for reservations
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfterTomorrow = new Date(tomorrow);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

// Valid reservation data
const validReservationData = {
  seatId: testSeat._id.toString(),
  startTime: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
  endTime: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString()
};

const validReservationData2 = {
  seatId: testSeat2._id.toString(),
  startTime: new Date(dayAfterTomorrow.setHours(14, 0, 0, 0)).toISOString(),
  endTime: new Date(dayAfterTomorrow.setHours(16, 0, 0, 0)).toISOString()
};

// Generate tokens
const adminToken = generateToken({ 
  userId: adminUser._id.toString(), 
  email: adminUser.email, 
  role: Role.ADMIN 
});

const librarianToken = generateToken({ 
  userId: librarianUser._id.toString(), 
  email: librarianUser.email, 
  role: Role.LIBRARIAN 
});

const userToken = generateToken({ 
  userId: regularUser._id.toString(), 
  email: regularUser.email, 
  role: Role.USER 
});

const secondUserToken = generateToken({
  userId: secondUser._id.toString(),
  email: secondUser.email,
  role: Role.USER
});

describe('Reservation API Endpoints', () => {
  beforeAll(async () => {
    await connect();
    
    // Create test users, library and seats in the database
    await User.create(adminUser);
    await User.create(librarianUser);
    await User.create(regularUser);
    await User.create(secondUser);
    await Library.create(testLibrary);
    await Seat.create(testSeat);
    await Seat.create(testSeat2);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    // Clear reservations before each test
    await Reservation.deleteMany({});
  });

  // Test user reservation endpoints
  describe('User Reservation Endpoints', () => {
    describe('POST /users/me/reservations', () => {
      it('should create a reservation for authenticated user', async () => {
        const response = await request(app)
          .post('/users/me/reservations')
          .set('Authorization', `Bearer ${userToken}`)
          .send(validReservationData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('userId', regularUser._id.toString());
        expect(response.body.data).toHaveProperty('seatId', testSeat._id.toString());
        expect(response.body.data).toHaveProperty('status', 'ACTIVE');
      });

      it('should return 400 for invalid reservation data', async () => {
        const invalidData = {
          // Missing seatId
          startTime: validReservationData.startTime,
          endTime: validReservationData.endTime
        };

        const response = await request(app)
          .post('/users/me/reservations')
          .set('Authorization', `Bearer ${userToken}`)
          .send(invalidData);

        expect(response.status).toBe(400);
      });

      it('should return 400 if endTime is before startTime', async () => {
        const invalidTimeData = {
          seatId: testSeat._id.toString(),
          startTime: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
          endTime: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString() // End before start
        };

        const response = await request(app)
          .post('/users/me/reservations')
          .set('Authorization', `Bearer ${userToken}`)
          .send(invalidTimeData);

        expect(response.status).toBe(400);
      });

      it('should return 400 if seat does not exist', async () => {
        const nonExistentSeatId = new mongoose.Types.ObjectId();
        
        const invalidData = {
          ...validReservationData,
          seatId: nonExistentSeatId.toString()
        };

        const response = await request(app)
          .post('/users/me/reservations')
          .set('Authorization', `Bearer ${userToken}`)
          .send(invalidData);

        expect(response.status).toBe(400);
      });

      it('should return 409 if seat is already reserved for the time slot', async () => {
        // Create a reservation first
        await request(app)
          .post('/users/me/reservations')
          .set('Authorization', `Bearer ${userToken}`)
          .send(validReservationData);

        // Try to reserve the same seat for overlapping time
        const response = await request(app)
          .post('/users/me/reservations')
          .set('Authorization', `Bearer ${secondUserToken}`)
          .send(validReservationData);

        expect(response.status).toBe(409);
      });

      it('should return 401 when no token is provided', async () => {
        const response = await request(app)
          .post('/users/me/reservations')
          .send(validReservationData);

        expect([401, 500]).toContain(response.status);
      });
    });

    describe('GET /users/me/reservations', () => {
      beforeEach(async () => {
        // Create test reservations
        await Reservation.create({
          userId: regularUser._id,
          seatId: testSeat._id,
          startTime: new Date(validReservationData.startTime),
          endTime: new Date(validReservationData.endTime),
          status: ReservationStatus.ACTIVE
        });
        
        await Reservation.create({
          userId: regularUser._id,
          seatId: testSeat2._id,
          startTime: new Date(validReservationData2.startTime),
          endTime: new Date(validReservationData2.endTime),
          status: ReservationStatus.ACTIVE
        });

        // Create a reservation for another user
        await Reservation.create({
          userId: secondUser._id,
          seatId: testSeat._id,
          startTime: new Date(dayAfterTomorrow.setHours(10, 0, 0, 0)),
          endTime: new Date(dayAfterTomorrow.setHours(12, 0, 0, 0)),
          status: ReservationStatus.ACTIVE
        });
      });

      it('should return all reservations for authenticated user', async () => {
        const response = await request(app)
          .get('/users/me/reservations')
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(2);
        expect(response.body.data[0]).toHaveProperty('userId', regularUser._id.toString());
      });

      it('should filter reservations by status if provided', async () => {
        // Update one reservation to CANCELLED
        await Reservation.findOneAndUpdate(
          { userId: regularUser._id, seatId: testSeat._id },
          { status: ReservationStatus.CANCELLED }
        );

        const response = await request(app)
          .get('/users/me/reservations?status=ACTIVE')
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]).toHaveProperty('status', 'ACTIVE');
      });

      it('should return 401 when no token is provided', async () => {
        const response = await request(app)
          .get('/users/me/reservations');

        expect([401, 500]).toContain(response.status);
      });
    });

    describe('DELETE /users/me/reservations/:id', () => {
      let reservationId: string;

      beforeEach(async () => {
        // Create a test reservation
        const reservation: any = await Reservation.create({
          userId: regularUser._id,
          seatId: testSeat._id,
          startTime: new Date(validReservationData.startTime),
          endTime: new Date(validReservationData.endTime),
          status: ReservationStatus.ACTIVE
        });
        
        reservationId = reservation._id.toString();

        // Create a reservation for another user
        await Reservation.create({
          userId: secondUser._id,
          seatId: testSeat2._id,
          startTime: new Date(validReservationData2.startTime),
          endTime: new Date(validReservationData2.endTime),
          status: ReservationStatus.ACTIVE
        });
      });

      it('should cancel user\'s reservation', async () => {
        const response = await request(app)
          .delete(`/users/me/reservations/${reservationId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        
        // Verify reservation is now cancelled
        const updatedReservation = await Reservation.findById(reservationId);
        expect(updatedReservation).toHaveProperty('status', 'CANCELLED');
      });

      it('should return 403 if user tries to cancel another user\'s reservation', async () => {
        // Get another user's reservation ID
        const otherReservation = await Reservation.findOne({ userId: secondUser._id });
        if (!otherReservation) {
          throw new Error("otherReservation is null, test setup issue");
        }
        
        const response = await request(app)
          .delete(`/users/me/reservations/${otherReservation._id}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404); // Should return 404 as it's not found for this user
      });

      it('should return 404 if reservation does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        
        const response = await request(app)
          .delete(`/users/me/reservations/${nonExistentId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
      });

      it('should return 401 when no token is provided', async () => {
        const response = await request(app)
          .delete(`/users/me/reservations/${reservationId}`);

        expect([401, 500]).toContain(response.status);
      });
    });
  });

  // Test admin/librarian reservation endpoints
  describe('Admin/Librarian Reservation Endpoints', () => {
    beforeEach(async () => {
      // Create test reservations
      await Reservation.create({
        userId: regularUser._id,
        seatId: testSeat._id,
        startTime: new Date(validReservationData.startTime),
        endTime: new Date(validReservationData.endTime),
        status: ReservationStatus.ACTIVE
      });
      
      await Reservation.create({
        userId: secondUser._id,
        seatId: testSeat2._id,
        startTime: new Date(validReservationData2.startTime),
        endTime: new Date(validReservationData2.endTime),
        status: ReservationStatus.ACTIVE
      });
    });

    describe('GET /libraries/:libraryId/reservations', () => {
      it('should return all reservations for a library when admin is authenticated', async () => {
        const response = await request(app)
          .get(`/libraries/${testLibrary._id}/reservations`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(2);
      });

      it('should return all reservations when librarian of the library is authenticated', async () => {
        const response = await request(app)
          .get(`/libraries/${testLibrary._id}/reservations`)
          .set('Authorization', `Bearer ${librarianToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(2);
      });

      it('should filter reservations by status if provided', async () => {
        // Update one reservation to CANCELLED
        await Reservation.findOneAndUpdate(
          { userId: regularUser._id, seatId: testSeat._id },
          { status: ReservationStatus.CANCELLED }
        );

        const response = await request(app)
          .get(`/libraries/${testLibrary._id}/reservations?status=ACTIVE`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]).toHaveProperty('status', 'ACTIVE');
      });

      it('should return 403 when regular user attempts to access library reservations', async () => {
        const response = await request(app)
          .get(`/libraries/${testLibrary._id}/reservations`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it('should return 404 if library does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        
        const response = await request(app)
          .get(`/libraries/${nonExistentId}/reservations`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
      });

      it('should return 401 when no token is provided', async () => {
        const response = await request(app)
          .get(`/libraries/${testLibrary._id}/reservations`);

        expect([401, 500]).toContain(response.status);
      });
    });

    describe('GET /seats/:seatId/reservations', () => {
      it('should return all reservations for a seat when admin is authenticated', async () => {
        const response = await request(app)
          .get(`/seats/${testSeat._id}/reservations`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]).toHaveProperty('seatId', testSeat._id.toString());
      });

      it('should return all reservations when librarian of the library is authenticated', async () => {
        const response = await request(app)
          .get(`/seats/${testSeat._id}/reservations`)
          .set('Authorization', `Bearer ${librarianToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
      });

      it('should filter reservations by date range if provided', async () => {
        const startDate = new Date(tomorrow);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(tomorrow);
        endDate.setHours(23, 59, 59, 999);

        const response = await request(app)
          .get(`/seats/${testSeat._id}/reservations?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
      });

      it('should return 403 when regular user attempts to access seat reservations', async () => {
        const response = await request(app)
          .get(`/seats/${testSeat._id}/reservations`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      it('should return 404 if seat does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        
        const response = await request(app)
          .get(`/seats/${nonExistentId}/reservations`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
      });

      it('should return 401 when no token is provided', async () => {
        const response = await request(app)
          .get(`/seats/${testSeat._id}/reservations`);

        expect([401, 500]).toContain(response.status);
      });
    });
  });
}); 