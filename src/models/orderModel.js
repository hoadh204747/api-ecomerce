const mongoose = require('mongoose');
const slugify = require('slugify');

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            amount: Number
        }
    ],
    shippingAddress:{
        fullname: String,
        phone: String,
        province: String,
        district: String,
        ward: String,
        address: String
    },
    paymentMethod: String,
    isPaid: {
        type: Boolean,
        default: false
    },
    totalPrice: Number,
    status: String,
    slugStatus: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
})

orderSchema.pre('findOneAndUpdate', async function(next) {
    // Lấy dữ liệu cập nhật
    const update = this.getUpdate();

    // Kiểm tra nếu có cập nhật trường status
    if (update && update.status) {
        // Tính toán slugStatus mới
        const newSlugStatus = slugify(update.status, {
            lower: true,
            strict: false,
            locale: 'vi',
        });

        // Cập nhật slugStatus mới
        this.setOptions({ new: true }); // Đảm bảo rằng hook trả về document đã được cập nhật
        this.findOneAndUpdate({}, { $set: { slugStatus: newSlugStatus } });
    }

    next();
});


module.exports = mongoose.model('Order', orderSchema)