const express = require('express');
const { getUserInfo } = require ('../controllers/userController/getUserInfoController.js')
const usersRoute = express.Router();

usersRoute.get('/user', getUserInfo);

exports.usersRoute = usersRoute;