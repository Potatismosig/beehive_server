require('dotenv').config();
const url = process.env.URL;
const { request } = require('express');
const mongodb = require('../../modules/databaseQuery');
const {getUsername} = require('../../modules/getUsername')
const { validate } = require('../../modules/validate');
const { toArray } = require('mongodb');

exports.profilePage = async function profilePage(req, res) {
const {profileUsername} = req.body;
const loggedInUsername  = getUsername(req, res);
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

        const usersQuery = await mongodb(url, 'BeeHive', 'users');

        //Show user information
        const user = {username: profileUsername}
        const findResult = await usersQuery.findOne(user);
        
        if (!findResult) {
            res.status(404).json('User not found');
            return;
        }

          // Check if logged-in user is following user
          const findLoggedInUserResult = await usersQuery.findOne({ username: loggedInUsername });
          if (!findLoggedInUserResult) {
              res.status(500).json('Internal error');
              return;
          }
          const isFollowingUser = findLoggedInUserResult.followers.includes(profileUsername);

        //Show user posts
        let userPosts = [];
        if(isFollowingUser) {
            const postsQuery = await mongodb(url, 'BeeHive', 'posts')
            userPosts = await postsQuery.find(user, true);
        }
            

        res.status(200).json({user: findResult, posts: userPosts});
         } 
         catch (error) {
        console.log(error);
        res.status(500).json('Internal error');
    }
};