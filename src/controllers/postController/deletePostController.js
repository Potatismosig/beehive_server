require('dotenv').config();
const url = process.env.URL;
const { ObjectId } = require('mongodb');

const { validate } = require('../../modules/validate');
const { getUsername } = require('../../modules/getUsername');
const mongodb = require('../../modules/databaseQuery');

exports.deletePost = async function deletePost(req, res) {
    try {
        const username = getUsername(req, res);

        const { postId } = req.body;
        const data = [
            { postId: postId, type: 'string', min: 3, max: 1000, required: true }
        ];

        const validationResult = validate(data, req, res);
        if (!validationResult) {
            // Validation failed, return early
            return;
        }

        const Query = await mongodb(url, 'BeeHive', 'posts')
        const findResult = await Query.findOne({_id: new ObjectId(postId)});
        
        if(!findResult){
            res.status(500).json("This post does not exsist");
            return;
        }

        if(findResult.username != username){
            res.status(500).json("You cannot delete this post");
            return;
        }

        const deleteResult = await Query.deleteOne({_id: new ObjectId(postId)});

        res.status(201).json('Deleted successfully');
        return;
    } catch (error) {
        res.status(500).json("error" + error);
    }
};
