const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController')
const BookController = require('../controllers/bookController')


router.post('/register',UserController.createUser)
router.post('/login',UserController.loginUser)
router.post('/books',BookController.createBook)
router.get('/books',BookController.getBooks)




module.exports = router;






