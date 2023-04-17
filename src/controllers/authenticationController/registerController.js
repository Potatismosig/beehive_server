const express = require('express');
require('dotenv').config();
const server = express();
server.use(express.json());
const cookieParser = require('cookie-parser');
server.use(cookieParser());
const bcrypt = require('bcrypt');
const secret = process.env.SECRET;
const url = process.env.URL;
const { validate } = require('../../modules/validate');
const mongodb = require('../../modules/databaseQuery');

exports.register = async function register(req, res) {
    const { username, password } = req.body;
    const data = [
        { username: username, type: 'string', min: 3, max: 50, required: true },
        { password: password, type: 'string', min: 3, max: 50, required: true },
    ];
    const validationResult = validate(data, req, res);
    if (!validationResult) {
        // Validation failed, return early
        return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    const user = { username: username, password: hashed };
    try {
        const insertQuery = await mongodb(url, 'BeeHive', 'users')
        const insertResult = await insertQuery.insertOne(user);
        res.status(201).json(insertResult);
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            res.status(409).json('' + error.keyValue.username + ' already exists');
            return;
        };
        res.status(500).json({ message: 'Something went wrong' });
    }



};
