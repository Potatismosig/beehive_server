const express = require('express');
require('dotenv').config();
const server = express();
server.use(express.json());


const { authenticationRoute } = require('./routes/authenticationRoute');


// express.json() gör samma sak som vi gjorde i våran egna middleware.
server.use(express.json());


server.use('/auth', authenticationRoute);


server.listen(5050);