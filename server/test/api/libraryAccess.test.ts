import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { generateToken } from '../../src/utils/jwtUtils';
import { Role } from '../../src/types/auth';
import { connect, clearDatabase, closeDatabase } from '../setup';
import User from '../../src/models/User';
import Library from '../../src/models/Library';
import { createTestLibraryData } from '../testUtils';

describe('Library Access Control', () => {
  let librarianToken: string;
  let libraryId: string;
  let otherLibraryId: string;
  let librarianId: mongoose.Types.ObjectId;

  beforeAll(async () => await connect());

  beforeEach(async () => {
    // Create librarian
    const librarian = await User.create({
      name: 'Test Librarian',
      email: 'librarian@test.com',
      password: 'password123',
      role: Role.LIBRARIAN
    });
    librarianId = librarian._id;

    librarianToken = generateToken({
      userId: librarianId.toString(),
      email: librarian.email,
      role: Role.LIBRARIAN
    });

    // Create two libraries
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

  describe('PATCH /libraries/:libraryId', () => {
    const updateData = { name: 'Updated Library' };

    it('should allow librarian to update assigned library', async () => {
      const response = await request(app)
        .patch(`/libraries/${libraryId}`)
        .set('Authorization', `Bearer ${librarianToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should not allow librarian to update unassigned library', async () => {
      const response = await request(app)
        .patch(`/libraries/${otherLibraryId}`)
        .set('Authorization', `Bearer ${librarianToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });

    it('should allow admin to update any library', async () => {
      const admin = await User.create({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: Role.ADMIN
      });

      const adminToken = generateToken({
        userId: admin._id.toString(),
        email: admin.email,
        role: Role.ADMIN
      });

      const response = await request(app)
        .patch(`/libraries/${otherLibraryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should maintain librarian assignments after library update', async () => {
      await request(app)
        .patch(`/libraries/${libraryId}`)
        .set('Authorization', `Bearer ${librarianToken}`)
        .send(updateData);

      const updatedLibrary = await Library.findById(libraryId);
      expect(updatedLibrary?.librarians.map(id => id.toString())).toContain(librarianId.toString());
    });
  });
}); 