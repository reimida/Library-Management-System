import * as userService from '../../src/services/userService';
import * as userRepository from '../../src/repositories/userRepository';
import { generateToken } from '../../src/utils/jwtUtils';
import { comparePasswords, hashPassword } from '../../src/utils/passwordUtils';
import { Role } from '../../src/types/auth';
import { ConflictError, BusinessError, NotFoundError } from '../../src/utils/errors';
import mongoose from 'mongoose';
import { IUser } from '../../src/models/User';

// Mock dependencies
jest.mock('../../src/repositories/userRepository');
jest.mock('../../src/utils/jwtUtils');
jest.mock('../../src/utils/passwordUtils');

const mockedUserRepo = userRepository as jest.Mocked<typeof userRepository>;
const mockedGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>;
const mockedComparePasswords = comparePasswords as jest.MockedFunction<typeof comparePasswords>;
const mockedHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should throw error when user does not exist', async () => {
      mockedUserRepo.findUserByEmail.mockResolvedValue(null);
      
      await expect(userService.loginUser({
        email: 'nonexistent@example.com',
        password: 'password'
      })).rejects.toThrow(BusinessError);
    });

    it('should throw error when password is invalid', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: Role.USER
      } as unknown as IUser;
      
      mockedUserRepo.findUserByEmail.mockResolvedValue(mockUser);
      mockedComparePasswords.mockResolvedValue(false);
      
      await expect(userService.loginUser({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow(BusinessError);
    });
  });

  describe('assignUserAsLibrarian', () => {
    it('should throw error if user is already a librarian', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'librarian@example.com',
        password: 'hashedpassword',
        name: 'Librarian User',
        role: Role.LIBRARIAN,
        toObject: jest.fn().mockReturnThis()
      } as unknown as IUser;
      
      mockedUserRepo.getUserById.mockResolvedValue(mockUser);
      
      await expect(userService.assignUserAsLibrarian(
        mockUser._id.toString(),
        'library123'
      )).rejects.toThrow(ConflictError);
      
      expect(mockedUserRepo.isUserAssignedToLibrary).not.toHaveBeenCalled();
    });

    it('should throw error if user is already assigned to the library', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'user@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: Role.USER,
        toObject: jest.fn().mockReturnThis()
      } as unknown as IUser;
      
      mockedUserRepo.getUserById.mockResolvedValue(mockUser);
      mockedUserRepo.isUserAssignedToLibrary.mockResolvedValue(true);
      
      await expect(userService.assignUserAsLibrarian(
        mockUser._id.toString(),
        'library123'
      )).rejects.toThrow(ConflictError);
      
      expect(mockedUserRepo.updateUserRoleInDB).not.toHaveBeenCalled();
    });

    it('should rollback role change if library update fails', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'user@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: Role.USER,
        toObject: jest.fn().mockReturnThis()
      } as unknown as IUser;
      
      mockedUserRepo.getUserById.mockResolvedValue(mockUser);
      mockedUserRepo.isUserAssignedToLibrary.mockResolvedValue(false);
      mockedUserRepo.updateUserRoleInDB.mockResolvedValue({...mockUser, role: Role.LIBRARIAN} as unknown as IUser);
      mockedUserRepo.addUserAsLibrarian.mockRejectedValue(new Error('Library update failed'));
      
      await expect(userService.assignUserAsLibrarian(
        mockUser._id.toString(),
        'library123'
      )).rejects.toThrow('Library update failed');
      
      expect(mockedUserRepo.updateUserRoleInDB).toHaveBeenCalledTimes(2);
      expect(mockedUserRepo.updateUserRoleInDB).toHaveBeenLastCalledWith(
        mockUser._id.toString(), 
        Role.USER
      );
    });
  });

  describe('removeUserAsLibrarian', () => {
    it('should throw error if user is not a librarian', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'user@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: Role.USER
      } as unknown as IUser;
      
      mockedUserRepo.getUserById.mockResolvedValue(mockUser);
      
      await expect(userService.removeUserAsLibrarian(
        mockUser._id.toString(), 
        'library123'
      )).rejects.toThrow(BusinessError);
      
      expect(mockedUserRepo.isUserAssignedToLibrary).not.toHaveBeenCalled();
    });

    it('should throw error if user is not assigned to the library', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'librarian@example.com',
        password: 'hashedpassword',
        name: 'Librarian User',
        role: Role.LIBRARIAN
      } as unknown as IUser;
      
      mockedUserRepo.getUserById.mockResolvedValue(mockUser);
      mockedUserRepo.isUserAssignedToLibrary.mockResolvedValue(false);
      
      await expect(userService.removeUserAsLibrarian(
        mockUser._id.toString(),
        'library123'
      )).rejects.toThrow(BusinessError);
      
      expect(mockedUserRepo.removeUserAsLibrarianFromDB).not.toHaveBeenCalled();
    });
  });
}); 