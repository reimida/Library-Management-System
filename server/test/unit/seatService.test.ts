import * as seatService from '../../src/services/seatService';
import { SeatRepository } from '../../src/repositories/seatRepository';
import { SeatStatus } from '../../src/validations/seatSchemas';
import { ConflictError, NotFoundError } from '../../src/utils/errors';
import mongoose, { Document } from 'mongoose';
import { ISeat } from '../../src/models/Seat';

// Simplified type definition
type ISeatDocument = Document<unknown, {}, ISeat> & ISeat & { __v: number };

// Mock the repository with a factory function
jest.mock('../../src/repositories/seatRepository', () => {
  // Create mock functions
  const mockFunctions = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCode: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    hasActiveReservations: jest.fn()
  };
  
  // Return the mock implementation
  return {
    SeatRepository: jest.fn().mockImplementation(() => mockFunctions)
  };
});

// Get the mock repository instance
const mockRepo = new SeatRepository() as jest.Mocked<SeatRepository>;

describe('Seat Service Tests', () => {
  const libraryId = 'library123';
  const seatId = 'seat123';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getSeats', () => {
    it('should get all seats for a library', async () => {
      const mockSeats = [
        { _id: 'seat1', code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE },
        { _id: 'seat2', code: 'A102', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE }
      ];
      
      mockRepo.findAll.mockResolvedValue(mockSeats as unknown as ISeatDocument[]);
      
      const result = await seatService.getSeats(libraryId);
      
      expect(result).toEqual(mockSeats);
      expect(mockRepo.findAll).toHaveBeenCalledWith(libraryId, {});
    });
    
    it('should apply filters when provided', async () => {
      const mockSeats = [
        { _id: 'seat1', code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE }
      ];
      
      mockRepo.findAll.mockResolvedValue(mockSeats as unknown as ISeatDocument[]);
      
      const result = await seatService.getSeats(libraryId, { floor: '1' });
      
      expect(result).toEqual(mockSeats);
      expect(mockRepo.findAll).toHaveBeenCalledWith(libraryId, { floor: '1' });
    });
  });
  
  describe('getSeatById', () => {
    it('should get a seat by ID', async () => {
      const mockSeat = { 
        _id: seatId, 
        code: 'A101', 
        floor: '1', 
        area: 'Main', 
        status: SeatStatus.AVAILABLE,
        __v: 0 
      } as ISeatDocument;
      
      mockRepo.findById.mockResolvedValue(mockSeat);
      
      const result = await seatService.getSeatById(libraryId, seatId);
      
      expect(result).toEqual(mockSeat);
      expect(mockRepo.findById).toHaveBeenCalledWith(libraryId, seatId);
    });
    
    it('should propagate NotFoundError', async () => {
      mockRepo.findById.mockRejectedValue(new NotFoundError('Seat'));
      
      await expect(seatService.getSeatById(libraryId, seatId))
        .rejects
        .toThrow(NotFoundError);
    });
  });
  
  describe('createSeat', () => {
    const seatData = {
      code: 'A101',
      floor: '1',
      area: 'Main',
      status: SeatStatus.AVAILABLE
    };
    
    it('should create a seat if code is unique', async () => {
      mockRepo.findByCode.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({
        _id: seatId,
        ...seatData,
        libraryId,
        __v: 0
      } as any as ISeatDocument);
      
      const result = await seatService.createSeat(libraryId, seatData);
      
      expect(result._id).toBe(seatId);
      expect(mockRepo.findByCode).toHaveBeenCalledWith(libraryId, seatData.code);
      expect(mockRepo.create).toHaveBeenCalledWith(libraryId, seatData);
    });
    
    it('should throw ConflictError if seat code already exists', async () => {
      const existingSeat = {
        _id: 'existingSeat',
        code: seatData.code,
        __v: 0
      } as ISeatDocument;
      
      mockRepo.findByCode.mockResolvedValue(existingSeat);
      
      await expect(seatService.createSeat(libraryId, seatData))
        .rejects
        .toThrow(ConflictError);
      
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });
  
  describe('updateSeat', () => {
    const updateData = {
      status: SeatStatus.OUT_OF_SERVICE,
      area: 'Updated Area'
    };
    
    it('should update a seat', async () => {
      const updatedSeat = {
        _id: seatId,
        code: 'A101',
        ...updateData,
        __v: 0
      } as any as ISeatDocument;
      
      mockRepo.update.mockResolvedValue(updatedSeat);
      
      const result = await seatService.updateSeat(libraryId, seatId, updateData);
      
      expect(result._id).toBe(seatId);
      expect(result.status).toBe(updateData.status);
      expect(mockRepo.update).toHaveBeenCalledWith(libraryId, seatId, updateData);
    });
    
    it('should check for code uniqueness when updating code', async () => {
      const updateWithCode = {
        code: 'B202'
      };
      
      // Mock finding an existing seat with the same code but different ID
      const differentSeat = {
        _id: 'differentSeat',
        code: updateWithCode.code,
        __v: 0
      } as ISeatDocument;
      
      mockRepo.findByCode.mockResolvedValue(differentSeat);
      
      await expect(seatService.updateSeat(libraryId, seatId, updateWithCode))
        .rejects
        .toThrow(ConflictError);
      
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
    
    it('should allow updating to the same code (same seat)', async () => {
      const updateWithCode = {
        code: 'A101'
      };
      
      // Mock finding the same seat
      const sameSeat = {
        _id: seatId,
        code: updateWithCode.code,
        __v: 0
      } as ISeatDocument;
      
      mockRepo.findByCode.mockResolvedValue(sameSeat);
      
      const updatedSeat = {
        _id: seatId,
        ...updateWithCode,
        __v: 0
      } as ISeatDocument;
      
      mockRepo.update.mockResolvedValue(updatedSeat);
      
      await seatService.updateSeat(libraryId, seatId, updateWithCode);
      
      expect(mockRepo.update).toHaveBeenCalledWith(libraryId, seatId, updateWithCode);
    });
  });
  
  describe('deleteSeat', () => {
    it('should delete a seat with no reservations', async () => {
      mockRepo.hasActiveReservations.mockResolvedValue(false);
      mockRepo.delete.mockResolvedValue({ _id: seatId } as any);
      
      await seatService.deleteSeat(libraryId, seatId);
      
      expect(mockRepo.hasActiveReservations).toHaveBeenCalledWith(seatId);
      expect(mockRepo.delete).toHaveBeenCalledWith(libraryId, seatId);
    });
    
    it('should throw ConflictError if seat has active reservations', async () => {
      mockRepo.hasActiveReservations.mockResolvedValue(true);
      
      await expect(seatService.deleteSeat(libraryId, seatId))
        .rejects
        .toThrow(ConflictError);
      
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });
  });
}); 