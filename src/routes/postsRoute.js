const express = require('express');

const { getUserPosts } = require('../controllers/postController/getUserPostsController');
const postsRoute = express.Router();

postsRoute.get('/userposts', getUserPosts);
exports.postsRoute = postsRoute;