const Attribute = require('../models/attributeModel')
const slugify = require('slugify');

const newAttribute = async (req,res) => {
    const {name} = req.body;
    try{
        const attribute = await Attribute.create({
            name,
            slug: slugify(name, {
                lower: true,
                strict: false,
                locale: 'vi',
            })
        });
        res.status(200).json({
            success: true,
            data: attribute
        })
    } catch(err){
        console.log(err);
    }
}

const getAllAttr = async (req, res) => {
    try{
        const attrs = await Attribute.find();
        return res.json({
            success: true,
            result: attrs
        })
    } catch(e){
        console.log(e);
    }
}

module.exports = {newAttribute, getAllAttr};