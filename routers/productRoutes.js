const express = require('express')
const router = express.Router()
const Product = require('../models/productModel')
const productController = require('../controllers/productController')

// router.post(`/`, (req, res) => {
//     const product = new Product({
//         name: req.body.name,
//         image: req.body.image,
//         countInStock: req.body.countInStock,
//     })

//     product
//         .save()
//         .then((result) => {
//             res.status(201).json(result)
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 error: err,
//                 success: false,
//             })
//         })
// })
router.post('/', productController.createProduct)

router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProduct)
router.patch('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)
// router.get('/get/count', productController.getProductCount)
router.get('/get/featured', productController.getIsFeatured)

module.exports = router
