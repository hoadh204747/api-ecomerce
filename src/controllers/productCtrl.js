const Product = require('../models/productModel')
const Category = require('../models/categoryModel');
const { default: slugify } = require('slugify');


const createProduct = async (req, res) => {
    const { name, description, price, discount, instock, brand, category, image } = req.body;
    try {
        const newProduct = await Product.create({
            name,
            description,
            price,
            discount,
            sell: false,
            brand,
            instock,
            sold: 0,
            category,
            image,
            slug: slugify(name),
        });
        res.json(newProduct);
    } catch (err) {
        console.log(err)
    }
}

const getAllProduct = async (req, res) => {
    try {
        let filter ={}
        const {brand, price} = req.query;
        if(brand){
            filter = {...filter ,brand: brand};
        }
        if(price){
            const [min, max] = price.split("-")
            const priceRange = {
                $gte: parseFloat(min),
                $lte: parseFloat(max)
            }
            filter = {...filter, price:priceRange};
        }
        
        const products = await Product.find(filter).populate("category");
        res.json({
            success: true,
            product: products,
        });
    } catch (err) {
        return res.status(401).json({
            mess: err
        })
    }
}

const getProduct = async (req, res) => {

    const id = req.params.id;
    try {
        const product = await Product.findById(id).populate("category").populate('reviews.reviewId');
        res.json(product)
    } catch (err) {
        console.log(err)
    }
}

const getProductByCategory = async (req, res) => {
    try {
        const category = await Category.find({})
        if (category.length > 0) {
            category.forEach((c) => {
                let product = Product.find({ "category": { _id: c._id } })
                res.json(product)
            })
        }
    } catch (err) {
        console.log(err)
    }
}

const updateProduct = async (req, res) => {
    const productId = req.params.productId;
    const imageUrls = req.body.imageUrl;

    try {
        // Xóa phần tử từ mảng image
        await Product.updateOne(
            { _id: productId },
            { $pull: { image: { $in: imageUrls } } }
        );

        // Cập nhật các trường khác trong tài liệu (nếu có)
        const updateData = { ...req.body };
        delete updateData.imageUrl; // Loại bỏ trường imageUrl
        const p = await Product.findOneAndUpdate(
            { _id: productId },
            { $set: updateData },
            { new: true }
        );

        res.json({
            success: true,
            message: "Cập nhật thành công",
            p: p
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật sản phẩm." });
    }
};

const updateSellProduct = async (req,res) => {
    const productId = req.body.productId;
    const sell = req.body.sell;
    await Product.findByIdAndUpdate(productId, {sell: sell}, {new: true})
        .then(() => {
            res.json({success: true})
        })
        .catch((err) => {
            console.log(err)
        })
}

const searchProduct = async (req, res) => {
    let search = req.body.search;
    const searchNoSpecialChar = search.replace(/[^a-zA-Z0-9 ]/g, "")
    const data = await Product.find({
        $or: [
            {name: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            {description: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            {brand: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
        ]
    })
    res.json({
        success: true,
        data: data
    })
}

const soldExpProduct = async (req, res) => {
    try{
        const products = await Product.find({sold: {$gte: 3}}).populate('category').exec()
        res.json(products)
    } catch(err){
        res.json(err)
    }
}

const sellProducts = async (req, res) => {
    const data = await Product.find({sell: true})
    res.json(data)
}


module.exports = { createProduct, getProduct, getProductByCategory, getAllProduct, updateProduct, updateSellProduct, searchProduct, soldExpProduct, sellProducts };