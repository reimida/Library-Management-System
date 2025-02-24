import { handleControllerError, validateAndExecute, sendSuccess, validateId } from '../../src/utils/controllerUtils';
import { Request, Response } from 'express';
import { z } from 'zod';
import { BusinessError, NotFoundError, ConflictError, AuthError } from '../../src/utils/errors';

describe('Controller Utils', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('handleControllerError', () => {
    it('should handle ZodError', () => {
      const zodError = new z.ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['name'],
          message: 'Name is required'
        }
      ]);
      
      handleControllerError(zodError, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: ['Name is required']
      });
    });

    it('should handle NotFoundError', () => {
      const error = new NotFoundError('User');
      
      handleControllerError(error, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });

    it('should handle ConflictError', () => {
      const error = new ConflictError('Email already in use');
      
      handleControllerError(error, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email already in use'
      });
    });

    it('should handle authorization BusinessError', () => {
      const error = new BusinessError('Not authorized to perform this action');
      
      handleControllerError(error, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to perform this action'
      });
    });

    it('should handle generic BusinessError', () => {
      const error = new BusinessError('Invalid operation');
      
      handleControllerError(error, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid operation'
      });
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unexpected error');
      
      handleControllerError(error, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('validateId', () => {
    it('should not throw error for valid ID', () => {
      expect(() => validateId('validId', 'user')).not.toThrow();
    });

    it('should throw BusinessError for invalid ID', () => {
      expect(() => validateId('', 'user')).toThrow(BusinessError);
      expect(() => validateId('', 'user')).toThrow('Invalid user ID format');
    });
  });
}); 