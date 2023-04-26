const mongodb = require('../../modules/databaseQuery');
const { getUsername } = require('../../modules/getUsername');
require('dotenv').config();
const url = process.env.URL;

exports.getFriendsPosts = async function getFriendsPosts(req, res) {
    try {
        const username = getUsername(req, res);
        const findQueryUsers = await mongodb(url, 'BeeHive', 'users')
        const userInfo = await findQueryUsers.findOne({ "username": username });
        const friends = userInfo.followers;

        const findQueryPosts = await mongodb(url, 'BeeHive', 'posts');
        const friendPosts = await findQueryPosts.find({ username: { $in: friends } }, true);
        res.status(200).json(friendPosts);
    } catch (error) {
        res.status(500).json('Internal error:' + error);
    }
};
