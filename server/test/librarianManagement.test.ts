import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { generateToken } from '../src/utils/jwtUtils';
import { Role } from '../src/types/auth';
import { connect, clearDatabase, closeDatabase } from './setup';
import User from '../src/models/User';
import Library from '../src/models/Library';
import { createTestLibraryData } from './testUtils';

describe('Librarian Management', () => {
  let adminToken: string;
  let userId: string;
  let libraryId: string;
  let adminId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connect();
    const admin = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: Role.ADMIN
    });
    adminId = admin._id;
    adminToken = generateToken({ 
      userId: adminId.toString(), 
      email: admin.email, 
      role: Role.ADMIN 
    });
  });

  beforeEach(async () => {
    // Create test user and library
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: Role.USER
    });
    userId = user._id.toString();

    const library = await Library.create({
      ...createTestLibraryData(),
      libraryCode: 'TEST001'
    });
    libraryId = library._id.toString();
  });

  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  describe('POST /users/:userId/librarian', () => {
    it('should assign librarian role to user', async () => {
      const response = await request(app)
        .post(`/users/${userId}/librarian`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ libraryId });

      expect(response.status).toBe(200);
      expect(response.body.data.role).toBe(Role.LIBRARIAN);

      // Verify library has new librarian
      const library = await Library.findById(libraryId);
      expect(library?.librarians.map(id => id.toString())).toContain(userId);
    });

    it('should fail if user is already a librarian', async () => {
      // First assignment
      await request(app)
        .post(`/users/${userId}/librarian`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ libraryId });

      // Second attempt
      const response = await request(app)
        .post(`/users/${userId}/librarian`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ libraryId });

      expect(response.status).toBe(400);
    });

    it('should fail when assigning librarian to non-existent library', async () => {
      const response = await request(app)
        .post(`/users/${userId}/librarian`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ libraryId: new mongoose.Types.ObjectId().toString() });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Library not found');
    });

    it('should fail when non-admin tries to assign librarian role', async () => {
      const regularUser = await User.create({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'password123',
        role: Role.USER
      });

      const userToken = generateToken({ 
        userId: regularUser._id.toString(), 
        email: regularUser.email, 
        role: Role.USER 
      });

      const response = await request(app)
        .post(`/users/${userId}/librarian`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ libraryId });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Unauthorized');
    });

    it('should add librarian to library librarians list', async () => {
      await request(app)
        .post(`/users/${userId}/librarian`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ libraryId });

      const library = await Library.findById(libraryId);
      expect(library?.librarians.map(id => id.toString())).toContain(userId);
    });
  });

  describe('DELETE /users/:userId/librarian', () => {
    beforeEach(async () => {
      // Setup: Make user a librarian first
      await request(app)
        .post(`/users/${userId}/librarian`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ libraryId });
    });

    it('should remove librarian role from user', async () => {
      const response = await request(app)
        .delete(`/users/${userId}/librarian`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ libraryId });

      expect(response.status).toBe(200);
      expect(response.body.data.role).toBe(Role.USER);

      // Verify library no longer has librarian
      const library = await Library.findById(libraryId);
      expect(library?.librarians.map(id => id.toString())).not.toContain(userId);
    });
  });
}); 