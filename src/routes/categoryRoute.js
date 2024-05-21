const express = require('express');
const router = express.Router();

const categoryCtrl = require('../controllers/categoryCtrl');

router.post('/create', categoryCtrl.createCatogory);
router.get('/list', categoryCtrl.listCategory)
router.delete('/:id', categoryCtrl.deleteCategory)

module.exports = router