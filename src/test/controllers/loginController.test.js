const request = require('supertest');
const express = require('express');
require('dotenv').config();

const { login } = require('../../controllers/authenticationController/loginController');
const app = express();

app.use(express.json());

app.post('/login', login);

describe('Login Endpoint', () => {
  

    // Test for successful login
    it('should log in a registered user', async () => {
      const testUser = {
        username: 'testuser1',
        password: 'testpassword',
    };
        const response = await request(app)
            .post('/login')
            .send(testUser);

        expect(response.status).toBe(200);
        expect(response.body).toBe('Login successful');
    });

    // Test for invalid login
    it('should return status 401 if invalid login', async () => {
    
      const testUser = {
        username: 'RandomUser',
        password: 'testpassword',
    };

        const response = await request(app)
            .post('/login')
            .send(testUser);

        expect(response.status).toBe(401);
        expect(response.text).toBe("\"Invalid credentials\"");
    });
    // Test for setting cookie on logged in user
it('should log in a registered user and set the token cookie', async () => {
    const testUser = {
      username: 'testuser1',
      password: 'testpassword',
    };
    const response = await request(app)
      .post('/login')
      .send(testUser);
  
    // Ensure the response status is 200
    expect(response.status).toBe(200);
    // Ensure the response body contains the message "Login successful"
    expect(response.body).toBe('Login successful');
    // Ensure the response has a "Set-Cookie" header
    expect(response.header).toHaveProperty('set-cookie');
    // Ensure the token cookie has a value
    const cookieHeader = response.header['set-cookie'][0];
    const tokenCookie = cookieHeader.split(';')[0];
    expect(tokenCookie).toMatch(/^token=.+/);
  });
  
});

