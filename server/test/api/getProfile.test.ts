import request from 'supertest';
import app from '../../src/app';
import { createTestUser, getAuthToken } from '../testUtils';
import { connect, clearDatabase, closeDatabase } from '../setup';

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Get User Profile', () => {
  it('should get the user profile when authenticated', async () => {
    // Setup
    const userData = {
      email: 'register.test@example.com',
      password: 'password123',
      name: 'Test User'
    };
    
    await createTestUser(userData);
    const authToken = await getAuthToken(userData.email, userData.password);

    // Test
    const response = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('email', userData.email);
    expect(response.body.data).toHaveProperty('name', userData.name);
    expect(response.body.data).not.toHaveProperty('password');
  });
}); 