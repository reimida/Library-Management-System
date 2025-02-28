import { Types } from 'mongoose';
import * as libraryService from '../../src/services/libraryService';
import * as libraryRepo from '../../src/repositories/libraryRepository';
import * as scheduleService from '../../src/services/scheduleService';
import { ILibrary } from '../../src/models/Library';
import { ConflictError, NotFoundError, BusinessError } from '../../src/utils/errors';
import { MongoServerError } from 'mongodb';
import type { CreateLibraryInput } from '../../src/services/libraryService';
import type { Document } from 'mongoose';

// Mock both repositories
jest.mock('../../src/repositories/libraryRepository');
jest.mock('../../src/services/scheduleService');

const mockedRepo = libraryRepo as jest.Mocked<typeof libraryRepo>;
const mockedScheduleService = scheduleService as jest.Mocked<typeof scheduleService>;

const mockLibraryInput: CreateLibraryInput = {
  name: 'Test Library',
  libraryCode: 'TEST001',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    postalCode: '12345',
    country: 'Test Country'
  },
  contactPhone: '123-456-7890',
  contactEmail: 'test@library.com',
  totalSeats: 100,
  isActive: true
};

function createMockLibrary(data: Partial<ILibrary> = {}): ILibrary {
  return {
    ...mockLibraryInput,
    _id: new Types.ObjectId(),
    librarians: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    // Add required Document methods
    $assertPopulated: jest.fn(),
    $clearModifiedPaths: jest.fn(),
    $clone: jest.fn(),
    $createModifiedPathsSnapshot: jest.fn(),
    $getAllSubdocs: jest.fn(),
    $ignore: jest.fn(),
    $inc: jest.fn(),
    $isDefault: jest.fn(),
    $isDeleted: jest.fn(),
    $isEmpty: jest.fn(),
    $isValid: jest.fn(),
    $locals: {},
    $markValid: jest.fn(),
    $model: jest.fn(),
    $op: null,
    $parent: jest.fn(),
    $session: jest.fn(),
    $set: jest.fn(),
    $toObject: jest.fn(),
    $where: jest.fn(),
    collection: {} as any,
    db: {} as any,
    delete: jest.fn(),
    deleteOne: jest.fn(),
    depopulate: jest.fn(),
    directModifiedPaths: jest.fn(),
    equals: jest.fn(),
    errors: {},
    get: jest.fn(),
    getChanges: jest.fn(),
    increment: jest.fn(),
    init: jest.fn(),
    invalidate: jest.fn(),
    isDirectModified: jest.fn(),
    isDirectSelected: jest.fn(),
    isInit: jest.fn(),
    isModified: jest.fn(),
    isNew: false,
    isSelected: jest.fn(),
    markModified: jest.fn(),
    modifiedPaths: jest.fn(),
    modelName: 'Library',
    overwrite: jest.fn(),
    populate: jest.fn(),
    populated: jest.fn(),
    remove: jest.fn(),
    replaceOne: jest.fn(),
    save: jest.fn(),
    schema: {} as any,
    set: jest.fn(),
    toJSON: jest.fn(),
    toObject: jest.fn(),
    unmarkModified: jest.fn(),
    update: jest.fn(),
    updateOne: jest.fn(),
    validate: jest.fn(),
    validateSync: jest.fn(),
    ...data
  } as unknown as ILibrary;
}

describe('Library Service', () => {
  const mockLibrary = createMockLibrary();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createLibrary', () => {
    it('should create a library successfully', async () => {
      mockedRepo.createLibraryInDB.mockResolvedValue(mockLibrary);
      // Mock the schedule creation to avoid timeout
      mockedScheduleService.createSchedule.mockResolvedValue({} as any);
      
      const result = await libraryService.createLibrary(mockLibraryInput);
      
      expect(result).toEqual(mockLibrary);
      expect(mockedRepo.createLibraryInDB).toHaveBeenCalledWith(mockLibraryInput);
      expect(mockedScheduleService.createSchedule).toHaveBeenCalled();
    });

    it('should throw ConflictError if library code already exists', async () => {
      mockedRepo.createLibraryInDB.mockRejectedValue(new ConflictError('Library with this code already exists'));
      
      await expect(libraryService.createLibrary(mockLibraryInput))
        .rejects
        .toThrow(ConflictError);
    });
  });

  describe('getLibrary', () => {
    it('should get a library successfully', async () => {
      mockedRepo.getLibraryById.mockResolvedValue(mockLibrary);
      
      const result = await libraryService.getLibrary(mockLibrary._id.toString());
      
      expect(result).toEqual(mockLibrary);
      expect(mockedRepo.getLibraryById).toHaveBeenCalledWith(mockLibrary._id.toString());
    });

    it('should throw NotFoundError if library does not exist', async () => {
      mockedRepo.getLibraryById.mockRejectedValue(new NotFoundError('Library'));
      
      await expect(libraryService.getLibrary(mockLibrary._id.toString()))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should throw BusinessError if library ID is invalid', async () => {
      mockedRepo.getLibraryById.mockRejectedValue(new BusinessError('Invalid library ID'));
      
      await expect(libraryService.getLibrary('invalid-id'))
        .rejects
        .toThrow(BusinessError);
    });
  });

  describe('updateLibrary', () => {
    const updateData = { name: 'Updated Library' };

    it('should update a library successfully', async () => {
      const updatedLibrary = createMockLibrary({ ...mockLibrary, ...updateData });
      mockedRepo.updateLibraryInDB.mockResolvedValue(updatedLibrary);
      
      const result = await libraryService.updateLibrary(mockLibrary._id.toString(), updateData);
      
      expect(result).toEqual(updatedLibrary);
      expect(mockedRepo.updateLibraryInDB).toHaveBeenCalledWith(mockLibrary._id.toString(), updateData);
    });

    it('should throw NotFoundError if library does not exist', async () => {
      mockedRepo.updateLibraryInDB.mockRejectedValue(new NotFoundError('Library'));
      
      await expect(libraryService.updateLibrary(mockLibrary._id.toString(), updateData))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should throw ConflictError if library code already exists', async () => {
      mockedRepo.updateLibraryInDB.mockRejectedValue(new ConflictError('Library with this code already exists'));
      
      await expect(libraryService.updateLibrary(mockLibrary._id.toString(), { libraryCode: 'EXISTING' }))
        .rejects
        .toThrow(ConflictError);
    });
  });

  describe('deleteLibrary', () => {
    it('should delete a library successfully', async () => {
      mockedRepo.deleteLibraryFromDB.mockResolvedValue(mockLibrary);
      // Mock the schedule deletion to avoid timeout
      mockedScheduleService.deleteSchedule.mockResolvedValue({} as any);
      
      const result = await libraryService.deleteLibrary(mockLibrary._id.toString());
      
      expect(result).toEqual(mockLibrary);
      expect(mockedRepo.deleteLibraryFromDB).toHaveBeenCalledWith(mockLibrary._id.toString());
      expect(mockedScheduleService.deleteSchedule).toHaveBeenCalledWith(mockLibrary._id.toString());
    });

    it('should throw NotFoundError if library does not exist', async () => {
      mockedRepo.deleteLibraryFromDB.mockRejectedValue(new NotFoundError('Library'));
      // Mock the schedule deletion to avoid timeout
      mockedScheduleService.deleteSchedule.mockResolvedValue({} as any);
      
      await expect(libraryService.deleteLibrary(mockLibrary._id.toString()))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('listLibraries', () => {
    it('should list all active libraries by default', async () => {
      mockedRepo.getAllLibraries.mockResolvedValue([mockLibrary]);
      
      const result = await libraryService.listLibraries();
      
      expect(result).toEqual([mockLibrary]);
      expect(mockedRepo.getAllLibraries).toHaveBeenCalledWith({ isActive: true });
    });

    it('should list all libraries when includeInactive is true', async () => {
      mockedRepo.getAllLibraries.mockResolvedValue([mockLibrary]);
      
      const result = await libraryService.listLibraries({ includeInactive: true });
      
      expect(result).toEqual([mockLibrary]);
      expect(mockedRepo.getAllLibraries).toHaveBeenCalledWith({});
    });
  });
}); 