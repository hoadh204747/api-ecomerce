const mongoose = require('mongoose')

const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: String
})

module.exports = mongoose.model('Attribute', attributeSchema )