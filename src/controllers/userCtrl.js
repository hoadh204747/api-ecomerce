const User = require('../models/userModel')
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { generateToken, generateRefreshToken } = require('../config/jwtToken')

const createUser = async (req, res) => {
    const {name, email, password, mobile} = req.body;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        const hashPassword = await bcrypt.hash(password, 10);
        if(name !== '' && email !== '' && password !== '' && mobile !== ''){
            const newUser = await User.create({
                name: name,
                email: email,
                password: hashPassword,
                mobile: mobile,
                block: false
            });
            res.json({
                user: newUser,
                success: true,
            });
        } else {
            res.json({
                msg: 'Xin hãy nhập đầy đủ thông tin',
            })
        }
    } else {
        res.json({
            msg: 'Email này đã được đăng ký',
            success: false
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email: email });
    if (findUser && (await findUser.isPasswordMatched(password))) {

        const accessToken = generateToken(findUser._id)
        const refreshToken = generateRefreshToken(findUser._id)

        // res.cookie('accessToken', accessToken);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: true,
            maxAge: 60 * 60 * 1000,
        });


        res.json({
            success: true,
            user: findUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } else {
        res.json({
            msg: 'Tài khoản hoặc mật khẩu chưa chính xác',
            success: false
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refreshToken')
        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công",
        });
    } catch (err) {
        return res.status(404).json({
            mess: e
        })
    }
}

const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json("You are not authenticated!")
    }
    jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        err && console.log(err)
        const accessToken = await generateToken(user.id);
        res.json({
            accessToken: accessToken
        })
    })
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json({
            success: true,
            message: "Thành công",
            user: updatedUser
        })
    } catch (err) {
        console.log(err);
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id)
            .then(() => {
                res.json('Delete success')
            })
    } catch (err) {
        console.log(err);
    }
}

const findUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(user) {
        res.json(user)
    } else {
        res.json({msg:'No such user'})
    }
}

const addToCart = async (req, res) => {
    const {productId, amount} = req.body;
    await Product.findById(productId)
        .then((product) => {
            res.json({product: product, success: true, message:"Product added to cart"});
            return req.user.addToCart(product, amount);
        })
}

const blockUser = async (req, res) => {
    const {userId, block} = req.body;
    await User.findByIdAndUpdate(userId, {block: block}, {new: true})
        .then(() => {
            res.json({success: true, message: "Thành công"})
        })
        .catch((err) => {
            console.log(err)
        })
}

const getInfoUser = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findOne({_id: userId})
    return res.json(user)
}

const getAllUsers = async (req, res) => {
    const users = await User.find({role:'user'})
    return res.json(users)
}


module.exports = { createUser, loginUser, logoutUser, updateUser, findUser, deleteUser, refreshToken, addToCart, blockUser, getInfoUser, getAllUsers };