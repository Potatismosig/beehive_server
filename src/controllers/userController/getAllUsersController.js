require('dotenv').config();
const url = process.env.URL;
const mongodb = require('../../modules/databaseQuery');
const {getUsername} = require('../../modules/getUsername.js')

exports.getAllUsers = async function getAllUsers(req, res) {

    try {
        const username = getUsername(req, res);
        const findQuery = await mongodb(url, 'BeeHive', 'users')
        const userInfo = await findQuery.findOne({ "username": username });
        const friends = userInfo.followers;
        const allUsers = await findQuery.find({ username: { $nin: friends.concat([username]) } }, true);
     
        res.status(200).json(allUsers);
        
         } catch (error) {
        console.log(error);
        res.status(500).json('Internal error');
    }
};