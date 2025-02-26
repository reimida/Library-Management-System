import { ILibrary } from '../src/models/Library';
import request from 'supertest';
import app from '../src/app';
import { Request, Response, NextFunction } from 'express';

export const createTestLibraryData = (overrides = {}): Partial<ILibrary> => ({
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
  isActive: true,
  ...overrides
});

export async function createTestUser(userData: { email: string; password: string; name: string }) {
  const response = await request(app)
    .post('/users/register')
    .send(userData);
    
  if (!response.body.success || !response.body.data?.user) {
    console.error('Register response:', JSON.stringify(response.body, null, 2));
    throw new Error(`Failed to create test user: ${JSON.stringify(response.body.errors || 'Unknown error')}`);
  }

  return response.body.data.user;
}

export async function getAuthToken(email: string, password: string) {
  const response = await request(app)
    .post('/users/login')
    .send({ email, password });
  
  if (!response.body.success || !response.body.data?.token) {
    console.error('Login response:', JSON.stringify(response.body, null, 2));
    throw new Error(`Failed to get auth token: ${JSON.stringify(response.body.errors || 'Unknown error')}`);
  }
  
  return response.body.data.token;
}

export const mockRequest = (data: any = {}): Partial<Request> => ({
  body: {},
  query: {},
  params: {},
  ...data
});

export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext: NextFunction = jest.fn(); 