require('dotenv').config();
const secret = process.env.SECRET;

exports.getUsername = function getUsername(res){
    const {Token} = req.cookies;
    // Verifierear tokenen.
    const loggedInUserToken = jwt.verify(Token, secret);
    if(!loggedInUserToken){
        res.status(401).json('Token not found');
        return;
    }
    const username = loggedInUserToken.username;
    return username;
}