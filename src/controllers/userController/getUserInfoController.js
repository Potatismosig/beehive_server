require('dotenv').config();
const url = process.env.URL;
const mongodb = require('../../modules/databaseQuery');


exports.getUserInfo = async function getUserInfo(req, res) {
    const { username } = req.body;

    try {
        const user = {username: username}
        const findQuery = await mongodb(url, 'BeeHive', 'users')
        const findResult = await findQuery.findOne(user);
        
        if (!findResult) {
            res.status(404).json('User not found')
            return;
        }
        res.json(findResult);
         } 
         catch (error) {
        console.log(error);
        res.status(500).json('Internal error');
    }
};