import request from 'supertest';
import app from '../../src/app';
import { connect, clearDatabase, closeDatabase } from '../setup';

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('User Login', () => {
  beforeEach(async () => {
    // Register a user first
    await request(app)
      .post('/users/register')
      .send({
        name: 'Test User',
        email: 'register.test@example.com',
        password: 'password123'
      });
  });

  it('should log in an existing user and return a token', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'register.test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
  });
});