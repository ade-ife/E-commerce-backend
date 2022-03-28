const express = require('express')

const orderController = require('../controllers/orderController')

const router = express.Router()

router.get('/', orderController.getAllOrders)
router.post('/post/orders', orderController.postOrders)
router.patch('/:id', orderController.updateOrder)
router.delete('/:id', orderController.deleteOrder)
router.get('/get/totalsales', orderController.getTotalSales)
router.get('/get/userorders/:userid', orderController.getUserOrder)

module.exports = router
