const express = require('express');
require('dotenv').config();
const server = express();
const cookieParser = require('cookie-parser');

server.use(express.json());
server.use(cookieParser());

const { checkAuthentication } = require('./middleware/checkAuthentication');
const { authenticationRoute } = require('./routes/authenticationRoute');
const { postsRoute } = require('./routes/postsRoute');

server.use('/auth', authenticationRoute);
server.use('/posts', checkAuthentication, postsRoute);

server.listen(5050);