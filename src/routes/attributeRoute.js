const express = require('express');
const router = express.Router();
const attributeCtrl = require('../controllers/attributeCtrl');

router.post('/create-attribute', attributeCtrl.newAttribute)
router.get('/attributes', attributeCtrl.getAllAttr)

module.exports = router