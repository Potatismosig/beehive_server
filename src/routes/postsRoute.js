const express = require('express');

const { getUserPosts } = require('../controllers/postController/getUserPosts');
const postsRoute = express.Router();

postsRoute.get('/userposts', getUserPosts);
exports.postsRoute = postsRoute;