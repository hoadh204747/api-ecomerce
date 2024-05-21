const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    block: {
        type: Boolean
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            amount: Number
        }],
    }
})

userSchema.methods.hashPassword = async function(password) {
    return await bcrypt.hash(this.password, 10);
}

userSchema.methods.isPasswordMatched = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}

userSchema.methods.addToCart = function (product, amount){
    const productIndex = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString())
    if(productIndex >= 0){
        this.cart.items[productIndex].amount += amount;
    } else {
        this.cart.items.push({
            productId : product._id ,
            amount : amount
        })
    }
    return this.save()
}

userSchema.methods.removeFromCart = function (product){
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== product._id.toString())
    this.cart.items = updatedCartItems
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []}
    return this.save()
}

module.exports = mongoose.model('User', userSchema)