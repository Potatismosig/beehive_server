const express = require('express');

const { getUserPosts } = require('../controllers/postController/getUserPostsController');
const { likePost } = require('../controllers/postController/likePostController');
const postsRoute = express.Router();

postsRoute.get('/userposts', getUserPosts);
postsRoute.patch('/likePost', likePost);
exports.postsRoute = postsRoute;