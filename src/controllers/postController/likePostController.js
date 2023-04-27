const { ObjectId } = require('mongodb');
const { validate } = require('../../modules/validate');
const mongodb = require('../../modules/databaseQuery');
const { getUsername } = require('../../modules/getUsername');
require('dotenv').config();
const url = process.env.URL;

exports.likePost = async function likePost(req, res) {
    try {
        const postId = req.body.postId;
        const username = getUsername(req);
        const data = [
            { postId: postId, type: 'string', min: 3, max: false, required: true }
        ];
        const validationResult = validate(data, req, res);
        if (!validationResult) {
            // Validation failed, return early
            return;
        }

        const Query = await mongodb(url, 'BeeHive', 'posts')
        const post = await Query.findOne({ _id: new ObjectId(postId) });
        if (!post) {
            res.status(404).json("This post does not exist");
            return;
        }

        const likes = post.likes || [];
        likes.push(username);

        const updateResult = await Query.updateOne({ _id: new ObjectId(postId) }, { $set: { likes: likes } });
        res.status(200).json(updateResult);
        return;
    } catch (error) {
        res.status(500).json('Internal error:' + error);
    }
};
