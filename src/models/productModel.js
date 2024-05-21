const mongoose = require('mongoose')

const productModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: String,
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
    },
    sell: Boolean,
    instock: Number,
    sold: Number,
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    image: {
        type: Array,
    },
    reviews: [
        {
            reviewId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Reviews'
            }
        }
    ]
})

module.exports = mongoose.model('Product', productModel)