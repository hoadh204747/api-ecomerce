const Category = require('../models/categoryModel')
const slugify = require('slugify');


const createCatogory = async (req, res) => {
    const { nameCategory } = req.body;
    try {
        const newCategory = await Category.create({
            nameCategory,
            slug: slugify(nameCategory, {
                lower: true,
                strict: false,
                locale: 'vi',
            }),
        });
        res.json(newCategory);
    } catch (err) {
        console.log(err)
    }
}

const listCategory = async (req, res) => {
    try {
        const listCategory = await Category.find();
        res.json({
            success: true,
            data: listCategory
        });
    } catch (err) {
        console.log(err)
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.findByIdAndDelete(categoryId)
            .then(() => {
                res.json({ success: true })
            })
    } catch (err) {
        console.log(err)
    }
}



module.exports = { createCatogory, listCategory, deleteCategory }