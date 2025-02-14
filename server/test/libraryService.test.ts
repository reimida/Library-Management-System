import { Types } from 'mongoose';
import * as libraryService from '../src/services/libraryService';
import * as libraryRepo from '../src/repositories/libraryRepository';
import { ILibrary } from '../src/models/Library';

// Mock the repository
jest.mock('../src/repositories/libraryRepository');
const mockedRepo = jest.mocked(libraryRepo);

describe('Library Service', () => {
  const mockLibrary: Partial<ILibrary> = {
    name: 'Central Library',
    libraryCode: 'CTL001',
    address: {
      street: '123 Main St',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country'
    },
    totalSeats: 100,
    isActive: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createLibrary', () => {
    it('should create a library successfully', async () => {
      mockedRepo.findLibraryByCode.mockResolvedValue(null);
      mockedRepo.createLibraryInDB.mockResolvedValue(mockLibrary as ILibrary);

      const result = await libraryService.createLibrary(mockLibrary as any);
      
      expect(result).toEqual(mockLibrary);
      expect(mockedRepo.findLibraryByCode).toHaveBeenCalledWith(mockLibrary.libraryCode);
      expect(mockedRepo.createLibraryInDB).toHaveBeenCalledWith(mockLibrary);
    });

    it('should throw error if library code already exists', async () => {
      mockedRepo.findLibraryByCode.mockResolvedValue(mockLibrary as ILibrary);

      await expect(libraryService.createLibrary(mockLibrary as any))
        .rejects
        .toThrow('Library with this code already exists');
    });
  });

  describe('updateLibrary', () => {
    const updateData = { name: 'Updated Library' };
    const libraryId = new Types.ObjectId().toString();

    it('should update library successfully', async () => {
      const updatedLibrary = { ...mockLibrary, ...updateData };
      mockedRepo.updateLibraryInDB.mockResolvedValue(updatedLibrary as ILibrary);

      const result = await libraryService.updateLibrary(libraryId, updateData);
      
      expect(result).toEqual(updatedLibrary);
      expect(mockedRepo.updateLibraryInDB).toHaveBeenCalledWith(libraryId, updateData);
    });

    it('should throw error if library not found', async () => {
      mockedRepo.updateLibraryInDB.mockResolvedValue(null);

      await expect(libraryService.updateLibrary(libraryId, updateData))
        .rejects
        .toThrow('Library not found');
    });
  });
}); 