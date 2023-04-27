const mongodb = require('../../modules/databaseQuery');
const { getUsername } = require('../../modules/getUsername');
require('dotenv').config();
const url = process.env.URL;

exports.getUserPosts = async function getUserPosts(req, res) {
    const username = getUsername(req);
    try {
        const user = { username: username };
        const collection = await mongodb(url, 'BeeHive', 'posts');
        const findQuery = await collection.find(user, true);
        res.status(200).json(findQuery);
    } catch (error) {
        res.status(500).json('Internal error');
    }
};
