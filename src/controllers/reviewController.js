const ReviewModel = require('../models/reviewModel')
const mongoose = require("mongoose")
const BookModel = require('../models/bookModel')
const ObjectId = mongoose.Types.ObjectId

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createReview = async function (req, res) {
    try {
        let data = req.body

        let { bookId, reviewedBy, reviewedAt, rating, review } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "request body can't be empty, BAD REQUEST" })
        }
        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "bookId is required" })
        }
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "bookId is not a valid bookId" })
        }
        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, msg: "reviewedBy is required" })
        }
        if (data.hasOwnProperty('reviewedAt')) {
            if (!isValid(reviewedAt)) {
                return res.status(400).send({ status: false, msg: "reviewedAt should contain valid dtata" })
            }
        }
        if (data.hasOwnProperty('reviewedAt')) {
            if (!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(reviewedAt))) {
                return res.status(400).send({ status: false, msg: "date should be in format, YYYY-MM-DD " })
            }
        }
        if (!rating) {
            return res.status(400).send({ status: false, msg: "rating is required" })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, msg: "rating should be in number from 1 to 5 only" })
        }
        if (data.hasOwnProperty('review')) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, msg: "review should ba a valid" })
            }
        }

        let bookDetails = await BookModel.find({ _id: bookId, isDeleted: false })
        if (!bookDetails) {
            return res.status(400).send({ status: false, msg: "no book exist with this bookId" })
        }
        else {
            let reviewCreated = await ReviewModel.create(data)
            let increaseBookReview = await BookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } })
            return res.status(201).send({ status: true, data: reviewCreated })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        let data = req.body

        let { review, rating, reviewerName } = data
        let reviewToBeUpdated = {}

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST" })
        }
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "bookId is not a valid objectId" })
        }
        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "reviewId is not a valid objectId" })
        }
        if (isValid(review)) {
            reviewToBeUpdated.review = review
        }
        if (isValid(rating) && (rating >= 1 && rating  <= 5)) {
            reviewToBeUpdated.rating = rating
        }
        if (isValid(reviewerName)) {
            reviewToBeUpdated.reviewedBy = reviewerName
        }
        let bookDetails = await BookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookDetails) {
            return res.status(404).send({ status: "book doesn't exist with this bookId" })
        }
        let reviewDetails = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewDetails) {
            return res.status(404).send({ status: false, msg: "reviews doesn't exist with this reviewId" })
        }
        else {
            let updatedReview = await ReviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, reviewToBeUpdated, { new: true })
            let reviewDetails = await ReviewModel.find({ bookId: bookId, isDeleted: false }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
            let bookData = bookDetails.toObject()
            bookData.reviewsData = reviewDetails
            return res.status(201).send({ status: true, msg: "review updated successfully", numberOfReviews: reviewDetails.length, data: bookData })
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

const deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "bookId is not a valid ObjectId" })
        }
        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "reviewId is not a valid ObjectId" })
        }
        let bookDetails = await BookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookDetails) {
            return res.status(404).send({ status: false, msg: "book doesn't exist with this bookId" })
        }
        let reviewDetails = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewDetails) {
            return res.status(404).send({ status: false, msg: "review doesn't exist with this reviewId" })
        }
        else {
            let reviewToBeDeleted = await ReviewModel.updateMany({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: true } })
            let bookReviewToBeDeleted = await BookModel.updateMany({ _id: reviewDetails.bookId }, { $inc: { reviews: -1 } })
            return res.status(201).send({ status: true, msg: "review deleted successfully" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview