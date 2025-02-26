import mongoose from 'mongoose';
import { connect, clearDatabase, closeDatabase } from '../setup';
import * as libraryRepository from '../../src/repositories/libraryRepository';
import Library, { ILibrary } from '../../src/models/Library';
import { ConflictError, NotFoundError, BusinessError } from '../../src/utils/errors';

describe('Library Repository Tests', () => {
  beforeAll(async () => await connect());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  const mockLibraryData = {
    name: 'Test Library',
    libraryCode: 'TEST001',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country'
    },
    contactPhone: '+1234567890',
    contactEmail: 'test@library.com',
    totalSeats: 100,
    isActive: true
  };

  describe('createLibraryInDB', () => {
    it('should create a library with valid data', async () => {
      const library = await libraryRepository.createLibraryInDB(mockLibraryData);
      expect(library._id).toBeDefined();
      expect(library.name).toBe(mockLibraryData.name);
    });

    it('should throw error for duplicate library code', async () => {
      await libraryRepository.createLibraryInDB(mockLibraryData);
      await expect(libraryRepository.createLibraryInDB(mockLibraryData))
        .rejects
        .toThrow(ConflictError);
    });

    it('should handle validation errors', async () => {
      const invalidData = { 
        ...mockLibraryData,
        libraryCode: '' // Empty code will fail validation
      };
      await expect(libraryRepository.createLibraryInDB(invalidData))
        .rejects
        .toThrow();
    });

    it('should handle invalid ObjectId format', async () => {
      await expect(libraryRepository.updateLibraryInDB('invalid-id', { name: 'New' }))
        .rejects
        .toThrow(BusinessError);
    });

    it('should handle duplicate library code on update', async () => {
      // Create first library
      await libraryRepository.createLibraryInDB(mockLibraryData);
      
      // Create second library
      const library2 = await libraryRepository.createLibraryInDB({
        ...mockLibraryData,
        libraryCode: 'TEST002'
      });

      // Try to update second library with first library's code
      await expect(
        libraryRepository.updateLibraryInDB(
          library2._id.toString(), 
          { libraryCode: 'TEST001' }
        )
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('updateLibraryInDB', () => {
    it('should update library fields', async () => {
      const library = await libraryRepository.createLibraryInDB(mockLibraryData);
      const updatedLibrary = await libraryRepository.updateLibraryInDB(
        library._id.toString(),
        { name: 'Updated Library', isActive: false }
      );
      expect(updatedLibrary.name).toBe('Updated Library');
      expect(updatedLibrary.isActive).toBe(false);
    });

    it('should throw NotFoundError for non-existent library', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(
        libraryRepository.updateLibraryInDB(fakeId, { name: 'New Name' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getLibraryById', () => {
    it('should return library by id', async () => {
      const created = await libraryRepository.createLibraryInDB(mockLibraryData);
      const found = await libraryRepository.getLibraryById(created._id.toString());
      expect(found.name).toBe(mockLibraryData.name);
    });

    it('should throw NotFoundError for non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(
        libraryRepository.getLibraryById(fakeId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw BusinessError for invalid id format', async () => {
      await expect(
        libraryRepository.getLibraryById('invalid-id')
      ).rejects.toThrow(BusinessError);
    });
  });

  describe('getAllLibraries', () => {
    it('should list all libraries by default', async () => {
      const active = await libraryRepository.createLibraryInDB(mockLibraryData);
      const inactive = await libraryRepository.createLibraryInDB({
        ...mockLibraryData,
        libraryCode: 'TEST002',
        isActive: false
      });

      const libraries = await libraryRepository.getAllLibraries();
      expect(libraries).toHaveLength(2);
    });

    it('should filter by isActive status', async () => {
      await libraryRepository.createLibraryInDB(mockLibraryData);
      await libraryRepository.createLibraryInDB({
        ...mockLibraryData,
        libraryCode: 'TEST002',
        isActive: false
      });

      const libraries = await libraryRepository.getAllLibraries({ isActive: true });
      expect(libraries).toHaveLength(1);
      expect(libraries[0].isActive).toBe(true);
    });

    it('should handle empty filters', async () => {
      await libraryRepository.createLibraryInDB(mockLibraryData);
      const libraries = await libraryRepository.getAllLibraries();
      expect(libraries).toHaveLength(1);
    });

    it('should handle undefined filters', async () => {
      await libraryRepository.createLibraryInDB(mockLibraryData);
      const libraries = await libraryRepository.getAllLibraries(undefined);
      expect(libraries).toHaveLength(1);
    });
  });

  describe('deleteLibraryFromDB', () => {
    it('should delete a library', async () => {
      const library = await libraryRepository.createLibraryInDB(mockLibraryData);
      await libraryRepository.deleteLibraryFromDB(library._id.toString());
      
      const found = await Library.findById(library._id);
      expect(found).toBeNull();
    });

    it('should throw NotFoundError for non-existent library', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(
        libraryRepository.deleteLibraryFromDB(fakeId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw BusinessError for invalid id format', async () => {
      await expect(
        libraryRepository.deleteLibraryFromDB('invalid-id')
      ).rejects.toThrow(BusinessError);
    });
  });

  describe('findLibraryByCode', () => {
    it('should find library by code case insensitive', async () => {
      await libraryRepository.createLibraryInDB(mockLibraryData);
      const found = await libraryRepository.findLibraryByCode('test001');
      expect(found).toBeDefined();
      expect(found?.libraryCode).toBe('TEST001');
    });

    it('should return null for non-existent code', async () => {
      const found = await libraryRepository.findLibraryByCode('NONEXISTENT');
      expect(found).toBeNull();
    });
  });
}); 