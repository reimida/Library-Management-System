import request from 'supertest';
import app from '../src/app';
import { createTestUser, getAuthToken } from './testUtils';
import { connect, clearDatabase, closeDatabase } from './setup';
import { IUser } from '../src/models/User';

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Update User Profile', () => {
  it('should update the user profile when authenticated', async () => {
    // Setup
    const userData = {
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'password123'
    };
    
    const user = await createTestUser(userData);
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
    
    const authToken = await getAuthToken(userData.email, userData.password);
    expect(authToken).toBeDefined();

    const updateData = {
      name: 'Updated Name'
    };

    const response = await request(app)
      .patch('/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.name).toBe(updateData.name);
    expect(response.body.data.user.email).toBe(userData.email);
  });

  it('should handle invalid update data', async () => {
    const userData = {
      name: 'Test User',
      email: 'test.user2@example.com',
      password: 'password123'
    };
    
    await createTestUser(userData);
    const authToken = await getAuthToken(userData.email, userData.password);

    const response = await request(app)
      .patch('/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: '' }); // Invalid name

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
}); 