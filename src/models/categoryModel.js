const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    nameCategory: {
        type: String,
        required: true,
    },
    slug: String
})

module.exports = mongoose.model('Category', categorySchema )