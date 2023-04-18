require('dotenv').config();
const bcrypt = require('bcrypt');
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
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(password, salt);

        const user = { username: username, password: hashed };

        const insertQuery = await mongodb(url, 'BeeHive', 'users')
        const insertResult = await insertQuery.insertOne(user);
        if (insertResult.acknowledged == true) {
            res.status(201).json('Registered successfully');
            return;
        }

    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json('' + error.keyValue.username + ' already exists');
            return;
        };
        res.status(500).json({ message: 'Something went wrong' });
    }
};
