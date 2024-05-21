const Product = require('../models/productModel');
const Reviews = require('../models/reviewsModel');

const createReview = async (req, res, next) => {
    try {
        const review = await Reviews.create({
            user: {
                userId: req.user,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.mobile
            },
            productId: req.params.productId,
            rating: req.body.rating,
            comment: req.body.comment,
            replyComment: []
        });

        await Product.updateOne(
            { _id: req.params.productId },
            { $push: { reviews: [{reviewId: review._id}]} }
        );

        res.status(200).json({
            success: true,
            message: "Thành công",
            data: review
        });
    } catch (err) {
        next(err);
    }
}

const replyComment = async (req, res) => {
    try{
        const reviewId = req.body.reviewId;
        const newReplyCmt = await Reviews.findByIdAndUpdate(
            reviewId,
            {
                $push: {replyComment:[{
                    name: req.user.name,
                    comment: req.body.comment,
                    date: Date.now()
                }]}
            }
        )
        res.status(200).json({
            success: true,
            message: "Thành công",
            data: newReplyCmt
        })
    } catch(err){
        console.log(err)
    }
}

module.exports = {
    createReview,
    replyComment,
}