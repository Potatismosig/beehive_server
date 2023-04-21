const express = require('express');
require('dotenv').config();
const server = express();
const cookieParser = require('cookie-parser');

server.use(express.json());
server.use(cookieParser());

const { checkAuthentication } = require('./middleware/checkAuthentication');

const { authenticationRoute } = require('./routes/authenticationRoute');
const { postsRoute } = require('./routes/postsRoute');
const { usersRoute } = require('./routes/usersRoute');

server.use('/auth', authenticationRoute);
server.use('/posts', checkAuthentication, postsRoute);
server.use('/users', checkAuthentication, usersRoute);

server.listen(5050);