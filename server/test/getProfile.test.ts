import request from 'supertest';
import app from '../src/app';
import { connect, clearDatabase, closeDatabase } from './setup';

describe('Get User Profile', () => {
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

  it('should get the user profile when authenticated', async () => {
    const response = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'register.test@example.com');
  });
}); 