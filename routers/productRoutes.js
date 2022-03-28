const express = require('express')
const router = express.Router()
const Product = require('../models/productModel')
const productController = require('../controllers/productController')
const Category = require('../models/categoryModel')

const multer = require('multer')
const { default: mongoose } = require('mongoose')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type')

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    },
})

const uploadOptions = multer({ storage: storage })

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid category')

    const file = req.file
    if (!file) return res.status(400).send('No image in the request')

    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload`
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save()

    if (!product) return res.status(500).send('The product cannot be created')

    res.send(product)
})
// router.post('/', productController.createProduct)

router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProduct)
router.patch('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)
// router.get('/get/count', productController.getProductCount)
router.get('/get/featured', productController.getIsFeatured)

router.patch(
    'gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
        }
        const files = req.files
        let imagesPaths = []
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.fileName}`)
            })
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        )
        if (!product)
            return res.status(500).send('The product cannot be updated')

        res.send(product)
    }
)

module.exports = router
