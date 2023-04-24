const express = require('express');

const { getUserInfo } = require ('../controllers/userController/getUserInfoController.js');
const { followUser } = require('../controllers/userController/followUserController.js');

const usersRoute = express.Router();

usersRoute.get('/user', getUserInfo);
usersRoute.post('/follow', followUser);

exports.usersRoute = usersRoute;