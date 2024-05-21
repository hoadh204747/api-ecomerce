const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl')
const orderCtrl = require('../controllers/orderCtrl');

const {authUser} = require('../middlewares/authUser')

router.post('/add-to-cart', authUser, userCtrl.addToCart)
router.post('/remove-from-cart', authUser, orderCtrl.removeFromCart)
router.get('/cart', authUser, orderCtrl.getCart)
router.post('/increase-product', authUser, orderCtrl.increaseProductFromCart)
router.post('/reduce-product', authUser, orderCtrl.reduceProductFromCart)

router.post('/create-order', authUser, orderCtrl.createNewOrder)
router.get('/orders', authUser, orderCtrl.getAllOrder)
router.get('/orders-n', orderCtrl.getAllOrderByAdmin)
router.put('/update-order', orderCtrl.updateOrder)

module.exports = router;