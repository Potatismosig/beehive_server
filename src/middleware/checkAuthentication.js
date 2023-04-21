const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.checkAuthentication = function checkAuthentication(req, res, next) {
    const token = req.cookies.token;
    try {
        const loggedInUser = jwt.verify(token, secret);
        req.loggedInUser = loggedInUser;
        next();
    }
    catch (error) {
        res.status(401).json('Authentication error: jwt expired');
    }
}
