require('dotenv').config();
const url = process.env.URL;
const { request } = require('express');
const mongodb = require('../../modules/databaseQuery');
const {getUsername} = require('../../modules/getUsername')
const { validate } = require('../../modules/validate');
const { toArray } = require('mongodb');

exports.profilePage = async function profilePage(req, res) {
const {profileUsername} = req.body;
const username = getUsername(req, res);
    //   res.status(200).json('test');

    try {
        const data = [
            { profileUsername: profileUsername, type: 'string', min: 3, max: 50, required: true }
             ];
    
        const validationResult = validate(data, req, res);
        if (!validationResult) {
            // Validation failed, return early
            return;
        }
        //Show user information
        const user = {username: profileUsername}
        const query = await mongodb(url, 'BeeHive', 'users')
        const findResult = await query.findOne(user);
        
        if (!findResult) {
            res.status(404).json('User not found');
            return;
        }
        
        //Show user posts
        const postsQuery = await mongodb(url, 'BeeHive', 'posts')
        const userPostsCursor = await postsQuery.find(user);
        const findUserPosts = await userPostsCursor.toArray();

        res.status(200).json({user: findResult, posts: findUserPosts});
         } 
         catch (error) {
        console.log(error);
        res.status(500).json('Internal error');
    }
};