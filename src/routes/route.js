const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController')
const BookController = require('../controllers/bookController');
const ReviewModel = require('../models/reviewModel');


router.post('/register', UserController.createUser)

router.post('/login', UserController.loginUser)

router.post('/books', BookController.createBook)

router.get('/getbooks', BookController.getBooks)

router.get('/books/:bookId', BookController.getBookById)

router.put('/books/:bookId', BookController.updateBook)

router.delete('/books/:bookId', BookController.deleteBook)




module.exports = router;






