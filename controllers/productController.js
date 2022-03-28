const Product = require('../models/productModel')
const mongoose = require('mongoose')

// exports.createProduct = async (req, res) => {
//     try {
//         const newProduct = await Product.create(req.body)
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 product: newProduct,
//             },
//         })
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err,
//         })
//     }
// }

exports.getAllProducts = async (req, res) => {
    try {
        let filter = {}
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') }
        }

        const products = await Product.find(filter).populate('category') //.select('-_id')

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products,
            },
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            'category'
        )

        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )

        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid Product')
        }
        await Product.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            message: 'Product deleted successfully',
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}

// exports.getIsFeatured = async (req, res) => {
//     try {
//         const products = await Product.find({ isFeatured: true })

//         res.status(204).json({
//             status: 'success',
//             data: {
//              products,
//             },
//         })
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err,
//         })
//     }
// }

exports.getIsFeatured = async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({ isFeatured: true }).limit(+count)

    if (!products) {
        res.status(500).json({ success: false })
    }
    res.send(products)
}
