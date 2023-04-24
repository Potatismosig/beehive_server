require('dotenv').config();
const url = process.env.URL;
const { ObjectId } = require('mongodb');

const { validate } = require('../../modules/validate');
const { getUsername } = require('../../modules/getUsername');
const mongodb = require('../../modules/databaseQuery');

exports.followUser = async function followUser(req, res) {
    try {
        const username = getUsername(req, res);

        const { followUsername } = req.body;
        const data = [
            { followUsername: followUsername, type: 'string', min: 3, max: 50, required: true }
        ];

        const validationResult = validate(data, req, res);
        if (!validationResult) {
            // Validation failed, return early
            return;
        }

        const Query = await mongodb(url, 'BeeHive', 'users')
        const findResult = await Query.findOne({username : followUsername});
        if(!findResult){
            res.status(500).json("This user does not exsist");
            return;
        }

        const updateResultFollowUsername = await Query.updateOne({username: username}, { $push: { followers: followUsername } });
        const updateResultUsername = await Query.updateOne({username: followUsername}, { $push: { followers: username } });

        res.status(201).json('followed successfully');
        return;
    } catch (error) {
        res.status(500).json("error" + error);
    }
};
