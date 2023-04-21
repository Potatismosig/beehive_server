require('dotenv').config();
const url = process.env.URL;

const { validate } = require('../../modules/validate');
const { getUsername } = require('../../modules/getUsername');
const mongodb = require('../../modules/databaseQuery');

exports.createPost = async function createPost(req, res) {
    try {
        const username = getUsername(req, res);

        const { postContent, link } = req.body;
        const data = [
            { postContent: postContent, type: 'string', min: 3, max: 1000, required: true },
            { link: link, type: 'string', min: 3, max: 1000, required: false }, 
        ];

        const validationResult = validate(data, req, res);
        if (!validationResult) {
            // Validation failed, return early
            return;
        }
        
        const post = { 
            username: username, 
            postContent: postContent, 
            link:link,
            likes: [
                
            ],
            comments: [
                
            ]
        
        };

        const insertQuery = await mongodb(url, 'BeeHive', 'posts')
        const insertResult = await insertQuery.insertOne(post);
        
        res.status(201).json(insertResult);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
