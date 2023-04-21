const express = require('express');
const { followUser } = require('../controllers/usersController/followUserController.js');

const usersRoute = express.Router();

usersRoute.post('/follow', followUser);

exports.usersRoute = usersRoute;