const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        enum: ["Mr", "Mrs", "Miss"],
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim : true,
        match: [/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/ ,'Please fill a valid phone number'],
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        maxlength: 15,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/ ,'Please fill a valid password'],
        required: true
        
    },
    address: {
        street: String,
        city: String,
        pincode: String
    },
}, {timestamps: true}) ;



module.exports = mongoose.model('user', userSchema)