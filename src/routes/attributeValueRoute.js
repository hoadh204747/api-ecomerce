const express = require('express');
const router = express.Router();
const attributeValueCtrl = require('../controllers/attributeValueCtrl');

router.post('/new-value', attributeValueCtrl.newAttributeValue)
router.get('/prod-by-attr', attributeValueCtrl.getDetail)
router.get('/attribute/:productId', attributeValueCtrl.getAttributeByProductId)
router.get('/all-attributes-value/:categoryId', attributeValueCtrl.getAllAttrValue)
router.get('/all-attr-value', attributeValueCtrl.getAllAttrValue2)

module.exports = router