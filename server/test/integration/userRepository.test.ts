import mongoose from 'mongoose';
import { connect, clearDatabase, closeDatabase } from '../setup';
import * as userRepository from '../../src/repositories/userRepository';
import User from '../../src/models/User';
import Library from '../../src/models/Library';
import { Role } from '../../src/types/auth';
import { NotFoundError, BusinessError, ConflictError } from '../../src/utils/errors';
import { createTestLibraryData } from '../testUtils';

describe('User Repository Tests', () => {
  beforeAll(async () => await connect());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());
  
  const testUserData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: Role.USER
  };
  
  describe('createUserInDB', () => {
    it('should create a user with valid data', async () => {
      const user = await userRepository.createUserInDB(testUserData);
      expect(user._id).toBeDefined();
      expect(user.email).toBe(testUserData.email);
    });
    
    it('should throw ConflictError for duplicate email', async () => {
      await userRepository.createUserInDB(testUserData);
      
      await expect(userRepository.createUserInDB(testUserData))
        .rejects
        .toThrow(ConflictError);
    });
  });
  
  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      await User.create(testUserData);
      
      const user = await userRepository.findUserByEmail(testUserData.email);
      expect(user).not.toBeNull();
      expect(user?.email).toBe(testUserData.email);
    });
    
    it('should return null for non-existent email', async () => {
      const user = await userRepository.findUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });
  
  describe('getUserById', () => {
    it('should get a user by ID', async () => {
      const createdUser = await User.create(testUserData);
      
      const user = await userRepository.getUserById(createdUser._id.toString());
      expect(user._id.toString()).toBe(createdUser._id.toString());
    });
    
    it('should throw NotFoundError for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await expect(userRepository.getUserById(fakeId))
        .rejects
        .toThrow(NotFoundError);
    });
    
    it('should throw BusinessError for invalid ID', async () => {
      await expect(userRepository.getUserById('invalid-id'))
        .rejects
        .toThrow(BusinessError);
    });
  });
  
  describe('updateUser', () => {
    it('should update a user', async () => {
      const user = await User.create(testUserData);
      
      const updatedUser = await userRepository.updateUser(
        user._id.toString(), 
        { name: 'Updated Name' }
      );
      
      expect(updatedUser.name).toBe('Updated Name');
    });
    
    it('should throw NotFoundError for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await expect(userRepository.updateUser(fakeId, { name: 'Updated' }))
        .rejects
        .toThrow(NotFoundError);
    });
    
    it('should throw ConflictError for duplicate email', async () => {
      await User.create({
        ...testUserData,
        email: 'existing@example.com'
      });
      
      const user = await User.create(testUserData);
      
      await expect(userRepository.updateUser(user._id.toString(), { email: 'existing@example.com' } as any))
        .rejects
        .toThrow(ConflictError);
    });
    
    it('should throw BusinessError for invalid ID', async () => {
      await expect(userRepository.updateUser('invalid-id', { name: 'Updated' }))
        .rejects
        .toThrow(BusinessError);
    });
  });
  
  describe('updateUserRoleInDB', () => {
    it('should update user role', async () => {
      const user = await User.create(testUserData);
      
      const updatedUser = await userRepository.updateUserRoleInDB(
        user._id.toString(), 
        Role.LIBRARIAN
      );
      
      expect(updatedUser.role).toBe(Role.LIBRARIAN);
    });
    
    it('should throw NotFoundError for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await expect(userRepository.updateUserRoleInDB(fakeId, Role.LIBRARIAN))
        .rejects
        .toThrow(NotFoundError);
    });
  });
  
  describe('addUserAsLibrarian and removeUserAsLibrarianFromDB', () => {
    let userId: string;
    let libraryId: string;
    
    beforeEach(async () => {
      const user = await User.create(testUserData);
      userId = user._id.toString();
      
      const library = await Library.create(createTestLibraryData());
      libraryId = library._id.toString();
    });
    
    it('should add user as librarian', async () => {
      const library = await userRepository.addUserAsLibrarian(userId, libraryId);
      
      expect(library.librarians.map(id => id.toString())).toContain(userId);
    });
    
    it('should remove user as librarian', async () => {
      // First add the user as librarian
      await userRepository.addUserAsLibrarian(userId, libraryId);
      
      // Then remove them
      const library = await userRepository.removeUserAsLibrarianFromDB(userId, libraryId);
      
      expect(library.librarians.map(id => id.toString())).not.toContain(userId);
    });
    
    it('should throw NotFoundError for non-existent library', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await expect(userRepository.addUserAsLibrarian(userId, fakeId))
        .rejects
        .toThrow(NotFoundError);
    });
    
    it('should throw BusinessError for invalid IDs', async () => {
      await expect(userRepository.addUserAsLibrarian('invalid-id', libraryId))
        .rejects
        .toThrow(BusinessError);
      
      await expect(userRepository.addUserAsLibrarian(userId, 'invalid-id'))
        .rejects
        .toThrow(BusinessError);
    });
  });
  
  describe('isUserAssignedToLibrary', () => {
    let userId: string;
    let libraryId: string;
    
    beforeEach(async () => {
      const user = await User.create(testUserData);
      userId = user._id.toString();
      
      const library = await Library.create({
        ...createTestLibraryData(),
        librarians: [new mongoose.Types.ObjectId(userId)]
      });
      libraryId = library._id.toString();
    });
    
    it('should return true if user is assigned to library', async () => {
      const isAssigned = await userRepository.isUserAssignedToLibrary(userId, libraryId);
      expect(isAssigned).toBe(true);
    });
    
    it('should return false if user is not assigned to library', async () => {
      const otherUser = await User.create({
        ...testUserData,
        email: 'other@example.com'
      });
      
      const isAssigned = await userRepository.isUserAssignedToLibrary(
        otherUser._id.toString(), 
        libraryId
      );
      
      expect(isAssigned).toBe(false);
    });
    
    it('should throw BusinessError for invalid IDs', async () => {
      await expect(userRepository.isUserAssignedToLibrary('invalid-id', libraryId))
        .rejects
        .toThrow(BusinessError);
      
      await expect(userRepository.isUserAssignedToLibrary(userId, 'invalid-id'))
        .rejects
        .toThrow(BusinessError);
    });
  });
  
  describe('getUserProfileFromDB', () => {
    it('should get user profile without password', async () => {
      const user = await User.create(testUserData);
      
      const profile = await userRepository.getUserProfileFromDB(user._id.toString());
      
      expect(profile).toBeDefined();
      expect(profile._id.toString()).toBe(user._id.toString());
      expect(profile).not.toHaveProperty('password');
    });
    
    it('should throw NotFoundError for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await expect(userRepository.getUserProfileFromDB(fakeId))
        .rejects
        .toThrow(NotFoundError);
    });
    
    it('should throw BusinessError for invalid ID', async () => {
      await expect(userRepository.getUserProfileFromDB('invalid-id'))
        .rejects
        .toThrow(BusinessError);
    });
  });
}); 