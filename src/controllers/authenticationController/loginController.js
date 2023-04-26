require('dotenv').config();
const bcrypt = require('bcrypt');
const url = process.env.URL;
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET;
const { validate } = require('../../modules/validate');
const mongodb = require('../../modules/databaseQuery');

exports.login = async function login(req, res) {
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
        const user = {username: username}
        const findQuery = await mongodb(url, 'BeeHive', 'users')
        const findResult = await findQuery.findOne(user);
       if (!findResult) {
            res.status(401).json('Invalid credentials')
            return;
        }
        const storedPassword = findResult.password;
        const isEqual = bcrypt.compareSync(password, storedPassword);

        if (!isEqual) {
            res.status(401).json('Invalid credentials')
            return;
        }

        const token = jwt.sign({username}, secret, {expiresIn: 2 * 60 * 60});
        res.cookie('token', token, {
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: 'none',
            // Secure är just nu buggat för Postman, använd inte secure: true för Postman.
            secure: true,
            httpOnly: false
        });
            
        res.status(200).json('Login successful');
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal error');
    }
};
