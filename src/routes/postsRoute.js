const express = require('express');
const { createPost } = require('../controllers/postController/createPostController');
const { likePost } = require('../controllers/postController/likePostController');
const { getUserPosts } = require('../controllers/postController/getUserPostsController');
const { deletePost } = require('../controllers/postController/deletePostController');
const { updatePost } = require('../controllers/postController/updatePostController');
const { commentPost } = require('../controllers/postController/commentPostController');

const postsRoute = express.Router();

postsRoute.get('/userposts', getUserPosts);
postsRoute.post('/create', createPost);
postsRoute.delete('/delete', deletePost);
postsRoute.put('/update', updatePost);
postsRoute.patch('/likePost', likePost);
postsRoute.post('/comment', commentPost)
exports.postsRoute = postsRoute;
