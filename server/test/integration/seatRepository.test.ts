import mongoose from 'mongoose';
import { connect, clearDatabase, closeDatabase } from '../setup';
import { SeatRepository } from '../../src/repositories/seatRepository';
import { Seat } from '../../src/models/Seat';
import Library from '../../src/models/Library';
import { SeatStatus } from '../../src/validations/seatSchemas';
import { NotFoundError, BusinessError, ConflictError } from '../../src/utils/errors';
import { createTestLibraryData } from '../testUtils';

describe('Seat Repository Tests', () => {
  let seatRepository: SeatRepository;
  let libraryId: string;
  
  beforeAll(async () => await connect());
  
  beforeEach(async () => {
    seatRepository = new SeatRepository();
    
    // Create a test library
    const library = await Library.create(createTestLibraryData());
    libraryId = library._id.toString();
  });
  
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());
  
  describe('findAll', () => {
    it('should find all seats for a library', async () => {
      // Create test seats
      await Seat.create([
        { code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId },
        { code: 'A102', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId }
      ]);
      
      const seats = await seatRepository.findAll(libraryId);
      expect(seats).toHaveLength(2);
    });
    
    it('should filter seats by floor', async () => {
      await Seat.create([
        { code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId },
        { code: 'B201', floor: '2', area: 'Study', status: SeatStatus.AVAILABLE, libraryId }
      ]);
      
      const seats = await seatRepository.findAll(libraryId, { floor: '1' });
      expect(seats).toHaveLength(1);
      expect(seats[0].code).toBe('A101');
    });
    
    it('should throw error for invalid library ID', async () => {
      await expect(seatRepository.findAll('invalid-id'))
        .rejects
        .toThrow(BusinessError);
    });
  });
  
  describe('findById', () => {
    it('should find a seat by ID', async () => {
      const seat = await Seat.create({
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId
      });
      
      const foundSeat = await seatRepository.findById(libraryId, (seat as any)._id.toString());
      expect(foundSeat.code).toBe('A101');
    });
    
    it('should throw NotFoundError for non-existent seat', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await expect(seatRepository.findById(libraryId, fakeId))
        .rejects
        .toThrow(NotFoundError);
    });
    
    it('should throw BusinessError for invalid seat ID', async () => {
      await expect(seatRepository.findById(libraryId, 'invalid-id'))
        .rejects
        .toThrow(BusinessError);
    });
    
    it('should throw BusinessError for invalid library ID', async () => {
      const seat = await Seat.create({
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId
      });
      
      await expect(seatRepository.findById('invalid-id', (seat as any)._id.toString()))
        .rejects
        .toThrow(BusinessError);
    });
  });
  
  describe('create', () => {
    it('should create a new seat', async () => {
      const seatData = {
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE
      };
      
      const seat = await seatRepository.create(libraryId, seatData);
      expect(seat.code).toBe('A101');
      expect(seat.libraryId.toString()).toBe(libraryId);
    });
    
    it('should throw ConflictError for duplicate seat code', async () => {
      const seatData = {
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE
      };
      
      await seatRepository.create(libraryId, seatData);
      
      await expect(seatRepository.create(libraryId, seatData))
        .rejects
        .toThrow(ConflictError);
    });
    
    it('should throw BusinessError for invalid library ID', async () => {
      const seatData = {
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE
      };
      
      await expect(seatRepository.create('invalid-id', seatData))
        .rejects
        .toThrow(BusinessError);
    });
  });
  
  describe('update', () => {
    it('should update a seat', async () => {
      const seat = await Seat.create({
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId
      });
      
      const updatedSeat = await seatRepository.update(
        libraryId, 
        (seat as any)._id.toString(), 
        { status: SeatStatus.OUT_OF_SERVICE }
      );
      
      expect(updatedSeat.status).toBe(SeatStatus.OUT_OF_SERVICE);
    });
    
    it('should throw NotFoundError for non-existent seat', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await expect(seatRepository.update(libraryId, fakeId, { status: SeatStatus.OUT_OF_SERVICE }))
        .rejects
        .toThrow(NotFoundError);
    });
    
    it('should throw ConflictError when updating to existing code', async () => {
      await Seat.create({
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId
      });
      
      const seat2 = await Seat.create({
        code: 'A102', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId
      });
      
      await expect(seatRepository.update(libraryId, (seat2 as any)._id.toString(), { code: 'A101' }))
        .rejects
        .toThrow(ConflictError);
    });
  });
  
  describe('delete', () => {
    it('should delete a seat', async () => {
      const seat = await Seat.create({
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId
      });
      
      await seatRepository.delete(libraryId, (seat as any)._id.toString());
      
      const found = await Seat.findById(seat._id);
      expect(found).toBeNull();
    });
    
    it('should throw NotFoundError for non-existent seat', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      await expect(seatRepository.delete(libraryId, fakeId))
        .rejects
        .toThrow(NotFoundError);
    });
  });
  
  describe('findByCode', () => {
    it('should find a seat by code', async () => {
      await Seat.create({
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId
      });
      
      const seat = await seatRepository.findByCode(libraryId, 'A101');
      expect(seat).not.toBeNull();
      expect(seat?.code).toBe('A101');
    });
    
    it('should return null for non-existent code', async () => {
      const seat = await seatRepository.findByCode(libraryId, 'NONEXISTENT');
      expect(seat).toBeNull();
    });
  });
  
  describe('hasActiveReservations', () => {
    it('should check for active reservations', async () => {
      const seat = await Seat.create({
        code: 'A101', floor: '1', area: 'Main', status: SeatStatus.AVAILABLE, libraryId
      });
      
      const hasReservations = await seatRepository.hasActiveReservations((seat as any)._id.toString());
      expect(hasReservations).toBe(false);
    });
    
    it('should throw BusinessError for invalid seat ID', async () => {
      await expect(seatRepository.hasActiveReservations('invalid-id'))
        .rejects
        .toThrow(BusinessError);
    });
  });
}); 