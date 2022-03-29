const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        required: true,
        ref: "book"
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
        required: true,
        format: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    reviews: String,
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })


module.exports = mongoose.model('review', reviewSchema)