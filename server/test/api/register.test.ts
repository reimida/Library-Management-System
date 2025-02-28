import request from 'supertest';
import app from '../../src/app';
import { connect, clearDatabase, closeDatabase } from '../setup';

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('User Registration', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'register.test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/users/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user.email).toBe(userData.email);
  });
}); 