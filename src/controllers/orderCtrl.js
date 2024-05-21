const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const { default: slugify } = require('slugify');

const getCart = async (req, res) => {
    try {
        const id = req.user._id
        const cart = await User.findById(id).populate('cart.items.productId').exec();
        return res.status(200).json(cart)
    } catch (err) {
        return res.status(404).json({
            message: err
        })
    }
}

const increaseProductFromCart = async (req, res) => {
    try {
        const id = req.user._id;
        const productId = req.body.productId;
        const cart = await User.updateOne(
            { _id: id, "cart.items._id": productId },
            { $inc: { "cart.items.$.amount": 1 } }
        );
        return res.status(200).json(cart)
    } catch (err) {
        return res.status(404).json({
            message: err
        })
    }
}

const reduceProductFromCart = async (req, res) => {
    try {
        const id = req.user._id;
        const productId = req.body.productId;
        // const cart = await User.updateOne(
        //     {_id: id, "cart.items.amount" : {$gt: 1}, "cart.items._id" : productId},
        //     { $inc: {"cart.items.$.amount" : -1}}
        // );
        const cart = await User.updateOne(
            {
                _id: id,
                $and: [
                    { "cart.items.amount": { $gt: 1 } },
                    { "cart.items._id": productId }
                ]
            },
            { $inc: { "cart.items.$.amount": -1 } }
        );
        return res.status(200).json(cart)
    } catch (err) {
        return res.status(404).json({
            message: err
        })
    }
}


const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    await Product.findById(productId)
        .then(product => {
            res.json({ success: true, message: "Product deleted from cart" });
            return req.user.removeFromCart(product)
        })
}

const createNewOrder = async (req, res) => {

    const {
        shippingAddress: {
            fullname,
            phone,
            province,
            district,
            ward,
            address
        },
        paymentMethod,
        isPaid
    } = req.body;

    if (!fullname || !phone || !province || !district || !ward || !address || !paymentMethod || !isPaid) {
        return res.status(400).json({ success: false, message: "Cần nhập đầy đủ các thông tin" });
    }
    
    const products = req.user.cart.items
    const items = await Promise.all(products.map(async (i) => {
        const p = await Product.findById(i.productId);
        return {
            product: p,
            amount: i.amount
        };
    }));
    let totalTemp = 0;
    items.forEach(p => {
        totalTemp += p.product.price * p.amount * (1 - p.product.discount * 0.01);
    })

    let status = "Chờ xác nhận"

    try {
        const newOrder = await Order.create({
            orderItems: items,
            shippingAddress: {
                fullname,
                phone,
                province,
                district,
                ward,
                address
            },
            paymentMethod,
            isPaid,
            totalPrice: totalTemp,
            status: status,
            slugStatus: slugify(status, {
                lower: true,
                strict: false,
                locale: 'vi',
            }),
            userId: req.user._id
        })
        items.forEach(async (p) => {
            await Product.updateOne(
                { _id: p.product._id },
                { $inc: { instock: -p.amount, sold: p.amount } }
            );
            // await Product.findById(p.product._id)
            //     .then(product => {
            //         return req.user.removeFromCart(product)
            //     })
        });
        res.status(200).json({ success: true, message: "Đơn hàng đã được tạo thành công", data: newOrder })
        return req.user.clearCart();

    } catch (err) {
        console.log(err)
    }
}

const getAllOrder = async (req, res) => {
    try {
        let query = { userId: req.user._id };
        if (req.query.status) {
            query.slugStatus = req.query.status;
        }
        const orders = await Order.find(query).populate('orderItems.product');
        return res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.log(err)
    }
}

const getAllOrderByAdmin = async (req, res) => {
    try {
        let query = {};
        if (req.query.status) {
            query = { slugStatus: req.query.status }
        }
        const orders = await Order.find(query).populate('orderItems.product');
        return res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.log(err)
    }
}

const updateOrder = async (req, res) => {
    const data = req.body
    const { orderId, ...rest } = data
    await Order.findByIdAndUpdate(orderId, rest, { new: true })
        .then(result => {
            return res.status(200).json({ success: true, message: 'Cập nhật đơn hàng thành công', data: result })
        })
}

module.exports = {
    getCart,
    increaseProductFromCart,
    reduceProductFromCart,
    removeFromCart,
    createNewOrder,
    getAllOrder,
    updateOrder,
    getAllOrderByAdmin
}