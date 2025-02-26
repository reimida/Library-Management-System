import { Request, Response } from 'express';
import * as libraryController from '../../src/controllers/libraryController';
import * as libraryService from '../../src/services/libraryService';
import { mockRequest, mockResponse, mockNext } from '../testUtils';
import { ConflictError, NotFoundError, BusinessError } from '../../src/utils/errors';

describe('Library Controller Tests', () => {
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
    totalSeats: 100
  };

  describe('createLibrary', () => {
    it('should handle validation errors', async () => {
      const req = mockRequest({
        body: { 
          ...mockLibraryData,
          libraryCode: '' // Invalid code
        }
      });
      const res = mockResponse();

      await libraryController.createLibrary(req as Request, res as Response, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle duplicate library codes', async () => {
      const req = mockRequest({ body: mockLibraryData });
      const res = mockResponse();

      jest.spyOn(libraryService, 'createLibrary')
        .mockRejectedValueOnce(new ConflictError('Library with this code already exists'));

      await libraryController.createLibrary(req as Request, res as Response, mockNext);
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('updateLibrary', () => {
    it('should handle invalid library ID format', async () => {
      const req = mockRequest({
        params: { libraryId: 'invalid-id' },
        body: { name: 'Updated' }
      });
      const res = mockResponse();

      await libraryController.updateLibrary(req as Request, res as Response, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle non-existent library', async () => {
      const req = mockRequest({
        params: { libraryId: '507f1f77bcf86cd799439011' },
        body: { name: 'Updated' }
      });
      const res = mockResponse();

      jest.spyOn(libraryService, 'updateLibrary')
        .mockRejectedValueOnce(new NotFoundError('Library'));

      await libraryController.updateLibrary(req as Request, res as Response, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('listLibraries', () => {
    it('should handle query parameters', async () => {
      const req = mockRequest({
        query: { includeInactive: 'true' }
      });
      const res = mockResponse();

      // Mock the service call
      jest.spyOn(libraryService, 'listLibraries')
        .mockResolvedValueOnce([/* mock library data */]);

      await libraryController.listLibraries(req as Request, res as Response, mockNext);
      expect(res.json).toHaveBeenCalled();
      expect(libraryService.listLibraries).toHaveBeenCalledWith({ includeInactive: true });
    });

    it('should handle service errors', async () => {
      const req = mockRequest({
        query: {}
      });
      const res = mockResponse();

      jest.spyOn(libraryService, 'listLibraries')
        .mockRejectedValueOnce(new Error('Database error'));

      await libraryController.listLibraries(req as Request, res as Response, mockNext);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
}); 