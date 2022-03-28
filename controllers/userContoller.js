const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const AppError = require('./../utils/appError')

exports.getAllUsers = async (req, res) => {
    const users = await User.find().select('-password')
    if (!users) {
        res.status(500).json({ success: false })
    }
    res.send(users)
}

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            },
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
    })
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    })
})

exports.login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.JWT_SECRET

    if (!user) {
        return res.status(400).send('The user was not found')
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                // to fix this later
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            secret,
            { expiresIn: '1d' }
        )
        res.status(200).send({ user: user.email, token: token })
    } else {
        res.status(400).send('password is wrong!')
    }
}

// exports.login = (req, res, next) => {
//     const { email, password } = req.body
//     // 1) Check if email and password exits
//     if (!email || !password) {
//         return next(new AppError('Please provide email and password!', 400))
//     }
//     // 2) check if user exists and password is correct

//     // const user = User.findOne/
//     // 3) if everything is ok, send token to client
//     const token = ''
//     res.status(200).json({
//         status: 'success',
//         token,
//     })
// }

exports.getUserCount = async (req, res) => {
    const userCount = await User.countDocuments()

    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        userCount: userCount,
    })
}

exports.deleteUser = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid User')
        }
        await User.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            message: 'User deleted successfully',
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}
