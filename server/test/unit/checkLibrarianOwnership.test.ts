import { checkLibrarianOwnership } from '../../src/middlewares/checkLibrarianOwnership';
import * as userService from '../../src/services/userService';
import { BusinessError } from '../../src/utils/errors';
import { Role } from '../../src/types/auth';
import { Request, Response } from 'express';
import { IUser } from '../../src/models/User';

jest.mock('../../src/services/userService');

const mockedGetUserById = jest.spyOn(userService, 'getUserById');
const mockedCheckAccess = jest.spyOn(userService, 'checkLibrarianAccess');

describe('checkLibrarianOwnership Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      params: { libraryId: 'library123' },
      user: { userId: 'user123', email: 'user@example.com', role: Role.LIBRARIAN }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call next if user is admin', async () => {
    mockRequest.user = { 
      userId: 'admin123', 
      email: 'admin@example.com', 
      role: Role.ADMIN 
    };
    
    mockedGetUserById.mockResolvedValue({
      _id: 'admin123' as any,
      email: 'admin@example.com',
      name: 'Admin',
      role: Role.ADMIN,
      password: 'hashedpw'
    } as unknown as IUser);
    
    await checkLibrarianOwnership(
      mockRequest as Request, 
      mockResponse as Response, 
      mockNext
    );
    
    expect(mockNext).toHaveBeenCalled();
    expect(mockedCheckAccess).not.toHaveBeenCalled();
  });

  it('should throw error if no user in request', async () => {
    mockRequest.user = undefined;
    
    await checkLibrarianOwnership(
      mockRequest as Request, 
      mockResponse as Response, 
      mockNext
    );
    
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Authentication required')
      })
    );
  });

  it('should throw error if user not found', async () => {
    mockedGetUserById.mockRejectedValue(new BusinessError('User not found'));
    
    await checkLibrarianOwnership(
      mockRequest as Request, 
      mockResponse as Response, 
      mockNext
    );
    
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'User not found'
      })
    );
  });

  it('should check librarian access and call next if user has access', async () => {
    mockedGetUserById.mockResolvedValue({
      _id: 'user123' as any,
      email: 'user@example.com',
      name: 'Librarian',
      role: Role.LIBRARIAN,
      password: 'hashedpw'
    } as unknown as IUser);
    
    mockedCheckAccess.mockResolvedValue(true);
    
    await checkLibrarianOwnership(
      mockRequest as Request, 
      mockResponse as Response, 
      mockNext
    );
    
    expect(mockedCheckAccess).toHaveBeenCalledWith('user123', 'library123');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw error if user does not have access to library', async () => {
    mockedGetUserById.mockResolvedValue({
      _id: 'user123' as any,
      email: 'user@example.com',
      name: 'Librarian',
      role: Role.LIBRARIAN,
      password: 'hashedpw'
    } as unknown as IUser);
    
    mockedCheckAccess.mockResolvedValue(false);
    
    await checkLibrarianOwnership(
      mockRequest as Request, 
      mockResponse as Response, 
      mockNext
    );
    
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Not authorized to manage this library'
      })
    );
  });
}); 