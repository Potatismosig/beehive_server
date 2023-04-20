const request = require('supertest');
const express = require('express');
require('dotenv').config();
const url = process.env.URL;

const { register } = require('../../controllers/authenticationController/registerController');
const db = require('../../modules/databaseQuery');
const app = express();

app.use(express.json());

app.post('/register', register);

describe('Register Endpoint', () => {
    const testUser = {
        username: 'testuser',
        password: 'testpassword',
    };

    afterEach(async () => {
        // Remove the user created by the tests
        const deleteQuery = await db(url, 'BeeHive', 'users')
        await deleteQuery.deleteOne({ username: testUser.username });
    });

    // Test for successful registration
    it('should create a new user and return status 201', async () => {
        const response = await request(app)
            .post('/register')
            .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body).toBe('Registered successfully');
    });

    // Test for duplicate usernames
    it('should return status 409 if the username already exists', async () => {
        await request(app)
            .post('/register')
            .send(testUser);

        const response = await request(app)
            .post('/register')
            .send(testUser);

        expect(response.status).toBe(409);
        expect(response.text).toBe(`\"${testUser.username} already exists\"`);
    });
});