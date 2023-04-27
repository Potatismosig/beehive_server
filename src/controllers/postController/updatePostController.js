require('dotenv').config();
const url = process.env.URL;
const { ObjectId } = require('mongodb');

const { validate } = require('../../modules/validate');
const { getUsername } = require('../../modules/getUsername');
const mongodb = require('../../modules/databaseQuery');

exports.updatePost = async function updatePost(req, res) {
    try {
        const username = getUsername(req, res);

        const { postId, newContent } = req.body;
        const data = [
            { postId: postId, type: 'string', min: 3, max: 1000, required: true },
            { newContent: newContent, type: 'string', min: 3, max: 1000, required: true }
        ];

        const validationResult = validate(data, req, res);
        if (!validationResult) {
            // Validation failed, return early
            return;
        }

        const Query = await mongodb(url, 'BeeHive', 'posts')
        const findResult = await Query.findOne({ _id: new ObjectId(postId) });
        if (!findResult) {
            res.status(404).json("This post does not exsist");
            return;
        }

        if (findResult.username != username) {
            res.status(403).json("You cannot update this post");
            return;
        }

        const updateResult = await Query.updateOne({ _id: new ObjectId(postId) }, { $set: { postContent: newContent } });

        res.status(200).json('Updated successfully');
        return;
    } catch (error) {
        res.status(500).json('Internal error:' + error);
    }
};
