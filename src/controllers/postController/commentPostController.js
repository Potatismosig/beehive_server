const { getUsername } = require('../../modules/getUsername')
const mongodb = require('../../modules/databaseQuery');
const { validate } = require('../../modules/validate');
require('dotenv').config();
const url = process.env.URL;
const { ObjectId } = require('mongodb');

exports.commentPost = async function commentPost(req, res) {
    try {
        const username = getUsername(req, res);

        const { postId, comments } = req.body;
        const data = [
            { comments: comments, type: 'string', min: 3, max: 1000, required: true },
            { postId: postId, type: 'string', min: 3, max: false, required: true }
        ];

        const validationResult = validate(data, req, res);
        if (!validationResult) {
            // Validation failed, return early
            return;
        }

        // Find the post with postId
        const postsQuery = await mongodb(url, 'BeeHive', 'posts');
        const post = await postsQuery.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        // Add comment to the post
        post.comments.push({
            username: username,
            text: comments,
            timestamp: new Date()
        });

        // Update the post with the new comment
        const updateResult = await postsQuery.updateOne(
            { _id: new ObjectId(postId) },
            { $push: { comments: { username, comment: comments } } }
        );
        if (updateResult.modifiedCount === 1) {
            res.status(201).json({ message: 'Comment added successfully' });
        } else {
            res.status(500).json({ message: 'Something went wrong' });
        }
    } catch (error) {
        res.status(500).json('Internal error:' + error);
    }
}

