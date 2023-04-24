const express = require('express');

const { createPost } = require('../controllers/postController/createPostController');
const { getUserPosts } = require('../controllers/postController/getUserPosts');

const postsRoute = express.Router();

postsRoute.get('/userposts', getUserPosts);
postsRoute.post('/create', createPost);

exports.postsRoute = postsRoute;