const express = require('express');
const { createPost } = require('../controllers/postsController/createPostController.js');

const postsRoute = express.Router();

postsRoute.post('/create', createPost);

exports.postsRoute = postsRoute;