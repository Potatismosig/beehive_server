require('dotenv').config();
const secret = process.env.SECRET;
const jwt = require('jsonwebtoken')

exports.getUsername = function getUsername(req, res) {
    const { Token } = req.cookies;
    if (!Token) {
      res.status(401).json('Token not found');
      return;
    }
    // Verifierar token.
    const loggedInUserToken = jwt.verify(Token, secret);
    if (!loggedInUserToken) {
      res.status(401).json('Token not found');
      return;
    }
    const username = loggedInUserToken.username;
    return username;
  };