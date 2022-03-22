const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync')
const mongoose = require('mongoose')

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
                userId: user.id,
            },
            secret,
            { expiresIn: '1d' }
        )
        res.status(200).send({ user: user.email, token: token })
    } else {
        res.status(400).send('password is wrong!')
    }
}
