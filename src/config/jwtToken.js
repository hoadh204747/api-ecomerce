const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const generateToken = function(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
};

const generateRefreshToken = function(id) {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN)
}

module.exports = {generateToken, generateRefreshToken}