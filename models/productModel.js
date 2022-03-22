const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
    },
    description: {
        type: String,
        required: [true, 'A product must have a description'],
    },
    richDescription: {
        type: String,
        default: ' ',
    },
    image: {
        type: String,
        default: ' ',
    },

    images: [
        {
            type: String,
        },
    ],
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'A product must have a category'],
    },
    countInStock: {
        type: Number,
        required: [true, 'A product must have a number in stock'],
        min: 0,
        max: 255,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.noe,
    },
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

productSchema.set('toJSON', {
    virtuals: true,
})
const Product = mongoose.model('Product', productSchema)

module.exports = Product
