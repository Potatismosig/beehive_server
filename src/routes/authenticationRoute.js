const express = require('express');
const { register } = require('../controllers/authenticationController/registerController.js');
const { login } = require('../controllers/authenticationController/loginController.js');
const authenticationRoute = express.Router();


// authenticationRoute.post('/login', login);
authenticationRoute.post('/register', register);
authenticationRoute.post('/login', login);



exports.authenticationRoute = authenticationRoute;