const express = require('express');
const { register } = require('../controllers/authenticationController/registerController.js');
const authenticationRoute = express.Router();


// authenticationRoute.post('/login', login);
authenticationRoute.post('/register', register);


exports.authenticationRoute = authenticationRoute;