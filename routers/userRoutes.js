const express = require('express')
const userController = require('../controllers/userContoller')

const router = express.Router()

router.get('/', userController.getAllUsers)
router.post('/', userController.createUser)
router.get('/:id', userController.getUser)
router.patch('/:id', userController.updateUser)
router.post('/signup', userController.signup)
router.post('/login', userController.login)

router.get('/get/count', userController.getUserCount)

module.exports = router
