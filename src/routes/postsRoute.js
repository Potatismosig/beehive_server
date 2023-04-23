const express = require('express');

const { createPost } = require('../controllers/postController/createPostController');
const { getUserPosts } = require('../controllers/postController/getUserPosts');
const { deletePost } = require('../controllers/postController/deletePostController');
const { updatePost } = require('../controllers/postController/updatePostController');

const postsRoute = express.Router();

postsRoute.get('/userposts', getUserPosts);
postsRoute.post('/create', createPost);
postsRoute.delete('/delete', deletePost);
postsRoute.put('/update', updatePost);

exports.postsRoute = postsRoute;
