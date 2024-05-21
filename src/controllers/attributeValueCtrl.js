const AttributeValue = require('../models/attributeValueModel')
const slugify = require('slugify');
const Product = require('../models/productModel')

const newAttributeValue = async (req,res) => {
    const {value, attributeId, productId} = req.body;
    try{
        const newValue = await AttributeValue.create({
            value,
            slug: slugify(value, {
                lower: true,
                strict: false,
                locale: 'vi',
            }),
            attributeId,
            productId
        });
        return res.status(200).json({
          success: true,
          data: newValue
        })
    } catch(err){
        console.log(err);
    }
}

// const getDetail = async (req, res) => {
//     try{
//         await AttributeValue.aggregate([
//             {
//               $facet: {
//                 redProducts: [
//                   { $match: { "slug": req.query.cpu } }
//                 ],
//                 eightProducts: [
//                   { $match: { "slug": req.query.ram } }
//                 ]
//               }
//             },
//             {
//               $project: {
//                 matchedProducts: { $setIntersection: ["$redProducts.productId", "$eightProducts.productId"] }
//               }
//             },
//             {
//                 $lookup: {
//                     from: "products",
//                     localField: "matchedProducts",
//                     foreignField:"_id",
//                     as: "productDetail"
//                 }
//             }
//           ])
//         .then(result => {
//             res.json(result)
//         })
//     } catch(e){
//         return res.status(404).json({message : e})
//     }
// }

const getDetail = async (req, res) => {
  try {
      const queryConditions = [
          { field: "cpu", queryField: "slug" },
          { field: "ram", queryField: "slug" },
          { field: "kich-thuoc", queryField: "slug" },
          { field: "tan-so", queryField: "slug" },
          { field: "do-phan-giai", queryField: "slug" },
          { field: "ket-noi", queryField: "slug" },
          { field: "vga", queryField: "slug" },
          { field: "os", queryField: "slug" },
      ];

      const conditions = queryConditions
          .filter(condition => req.query[condition.field])
          .map((condition, index) => ({
              [`group${index + 1}`]: [
                  { $match: { [condition.queryField]: req.query[condition.field] } }
              ]
          }));

      const aggregateQuery = [
          { $facet: Object.assign({}, ...conditions) },
          {
              $project: {
                  matchedProducts: {
                      $setIntersection: conditions.map((_, i) => `$group${i+1}.productId`)
                  }
              }
          },
          {
              $lookup: {
                  from: "products",
                  localField: "matchedProducts",
                  foreignField: "_id",
                  as: "productDetail"
              }
          }
      ];

      const result = await AttributeValue.aggregate(aggregateQuery);
      res.json({
        success: true,
        data: result
      });
  } catch (error) {
      return res.status(404).json({ message: error });
  }
};



const getAttributeByProductId = async (req, res) => {
  try{
    const productId = req.params.productId;
    const attributeType = await AttributeValue.find({'productId': {_id: productId}}).populate('attributeId').exec();
    res.status(200).json(attributeType)
  } catch(e){
    console.log(e)
  }
}

const getAllAttrValue = async (req, res) => {
  try{
    const categoryId = req.params.categoryId;
    const result = await AttributeValue.find({
      'productId': {
          $in: await Product.find({
              'category': categoryId
          }).distinct('_id')
      }
  }).populate(['attributeId', 'productId']).exec();
    return res.json({
      success: true,
      data: result
    })
  } catch(e){
    console.log(e);
  }
}

const getAllAttrValue2 = async (req, res) => {
  try{
    const result = await AttributeValue.find({
      
  }).populate(['attributeId', 'productId']).exec();
    return res.json({
      success: true,
      data: result
    })
  } catch(e){
    console.log(e);
  }
}

module.exports = {newAttributeValue, getDetail, getAttributeByProductId, getAllAttrValue, getAllAttrValue2};