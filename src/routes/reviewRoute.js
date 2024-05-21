const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviewsCtrl')
const {authUser, authIsAdmin} = require('../middlewares/authUser')

router.post('/review/:productId', authUser, reviewsCtrl.createReview)
router.post('/reply-cmt', authUser, reviewsCtrl.replyComment)

module.exports = router