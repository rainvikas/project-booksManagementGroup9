const BookModel = require('../models/bookModel')
const UserModel = require('../models/userModel')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
// const isValidValues = function (value) {
//     if (typeof value === 'string' && value.trim().length === 0) return false
//     return true;
// }

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createBook = async function (req, res) {
    try {

        let data = req.body

        let { title, excerpt, userId, ISBN, category, subCategory, reviews, isDeleted, deletedAt, releasedAt } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "title is required" })
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "excerpt is required" })
        }
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, msg: "userId is required" })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "userId is not a valid ObjectId" })
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN is required" })
        }
        if (!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))) {
            return res.status(400).send({ status: false, msg: "ISBN type is not valid " })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "category is required" })
        }
        if (!isValid(subCategory)) {
            return res.status(400).send({ status: false, msg: "subCategory is required" })
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, msg: "releasedAt is required" })
        }
        if (!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt))) {
            return res.status(400).send({ status: false, msg: "date is not in the format of YYYY-MM-DD " })
        }

        let isTitleAlreadyUsed = await BookModel.findOne({ title })
        if (isTitleAlreadyUsed) {
            return res.status(400).send({ status: false, msg: "title is already used please provide diffrent title" })
        }

        let isIsbnAlreadyUsed = await BookModel.findOne({ ISBN })
        if (isIsbnAlreadyUsed) {
            return res.status(400).send({ status: false, msg: " ISBN no. is alraedy used please provide diffrent ISBN no. " })
        }

        let userDetails = await UserModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "details with this userId doesn't exist" })
        }
        if (isDeleted == true) {
            let bookCreated = { title, excerpt, userId, ISBN, category, subCategory, reviews, isDeleted, deletedAt: Date.now(), releasedAt }
            let createdBook = await BookModel.create(bookCreated)
            return res.status(201).send({ status: true, data: createdBook })
        }
        else {
            let createdBook = await BookModel.create(data)
            return res.status(201).send({ status: true, data: createdBook })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

const getBooks = async function (req, res) {
    try {
        let data = req.query

        let { userId, category, subCategory } = data

        let filterQuery = { isDeleted: false }

        if (isValid(userId) && isValidObjectId(userId)) {
            filterQuery['userId'] = userId
        }
        if (isValid(category)) {
            filterQuery['category'] = category
        }
        if (isValid(subCategory)) {
            filterQuery['subCategory'] = subCategory
        }

        let filteredBooks = await BookModel.find(filterQuery)
            .select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
        if (Object.keys(filteredBooks).length == 0) {
            return res.status(404).send({ status: false, msg: "no books exist with this filter" })
        }
        else {
            return res.status(200).send({ status: true, NumberOfBooks: filteredBooks.length, data: filteredBooks })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

module.exports.createBook = createBook
module.exports.getBooks = getBooks