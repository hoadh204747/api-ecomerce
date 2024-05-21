const mongoose = require('mongoose')

const attributeValueSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
    },
    slug: String,
    attributeId:{type: mongoose.Schema.Types.ObjectId, ref: "Attribute"},
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
})

module.exports = mongoose.model('AttributeValue', attributeValueSchema )