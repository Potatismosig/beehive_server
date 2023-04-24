const express = require('express');

const { getUserInfo } = require ('../controllers/userController/getUserInfoController.js');
const { followUser } = require('../controllers/userController/followUserController.js');
const { getAllUsers } = require('../controllers/userController/getAllUsersController.js');
const { profilePage } = require('../controllers/userController/profilePageController.js')

const usersRoute = express.Router();

usersRoute.get('/user', getUserInfo);
usersRoute.get('/allUsers', getAllUsers);
usersRoute.post('/follow', followUser);
usersRoute.post('/profile', profilePage)

exports.usersRoute = usersRoute;