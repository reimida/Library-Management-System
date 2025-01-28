import request from 'supertest';
import app from '../src/app';
import { connect, clearDatabase, closeDatabase } from './setup';

describe('Update User Profile', () => {
  let authToken: string;

  beforeAll(async () => {
    await connect();
    // Register and login to get token
    await request(app)
      .post('/users/register')
      .send({
        name: 'Test User',
        email: 'register.test@example.com',
        password: 'password123'
      });

    const loginResponse = await request(app)
      .post('/users/login')
      .send({
        email: 'register.test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  it('should update the user profile when authenticated', async () => {
    const updateData = {
      name: 'Updated Name'
    };

    const response = await request(app)
      .patch('/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.user.name).toBe(updateData.name);
  });
}); 