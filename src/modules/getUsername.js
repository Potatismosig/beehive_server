require('dotenv').config();
const secret = process.env.SECRET;
const jwt = require('jsonwebtoken')

exports.getUsername = function getUsername(req, res) {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json('Token not found');
    return;
  }
  // Verifierar token.
  const loggedInUserToken = jwt.verify(token, secret);
  if (!loggedInUserToken) {
    res.status(401).json('Token not found');
    return;
  }
  const username = loggedInUserToken.username;
  return username;
};