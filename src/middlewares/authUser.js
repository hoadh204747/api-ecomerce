const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id)
                req.user = user;
                next();
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const authIsAdmin = async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email: email });
    if(adminUser.role == 'admin'){
        next();
    }
}

module.exports = { authUser, authIsAdmin }