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

exports.register = function register(req, res) {
    const { username, password } = req.body;
    const data = [{ username: username, type: 'string', min: 3, max: 50, required: true }, { password: password, type: 'string', min: 3, max: 50, required: true }];
    const validationResult = validate(data, req, res);

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    const user = { username: username, password: hashed }

    async function insertUser(url, user) {
        const insertQuery = await mongodb(url, 'BeeHive', 'users');
        const insertQueryResult = await insertQuery.insertOne(user);
        return insertQueryResult;
    }

    const insertResult = insertUser(url, user);


    res.status(201).json(insertResult);
}