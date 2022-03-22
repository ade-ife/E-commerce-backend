const express = require('express')

const categoryController = require('../controllers/categoryController')

const router = express.Router()

router.post('/', categoryController.createCategory)
router.delete('/:id', categoryController.deleteCategory)
router.get('/', categoryController.getAllCategories)
router.get('/:id', categoryController.getCategory)
router.patch('/:id', categoryController.updateCategory)

module.exports = router
