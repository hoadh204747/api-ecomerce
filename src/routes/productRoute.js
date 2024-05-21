const express = require('express');
const router = express.Router();

const { authUser, authIsAdmin } = require('../middlewares/authUser')
const productCtrl = require('../controllers/productCtrl');
const upload = require('../config/multer')
const handleUpload = require('../config/cloudinary')

router.post('/upload', upload.array('product', 5), handleUpload)
router.post('/create-product', productCtrl.createProduct);
router.get('/type-product', productCtrl.getProductByCategory)
router.put('/update/:productId', productCtrl.updateProduct)
router.put('/updatesell', productCtrl.updateSellProduct)
router.post('/search', productCtrl.searchProduct)
router.get('/soldExpProduct', productCtrl.soldExpProduct)
router.get('/sells', productCtrl.sellProducts)
router.get('/:id', productCtrl.getProduct)
router.get('/', productCtrl.getAllProduct)

module.exports = router;    