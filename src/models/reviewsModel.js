const mongoose = require('mongoose')

const reviewsSchema = new mongoose.Schema({
    user: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        phone: String
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    rating: {
        type: Number
    },
    comment: {
        type: String
    },
    replyComment: [
        {
            name: String,
            comment: String,
            date: Date
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Reviews', reviewsSchema)