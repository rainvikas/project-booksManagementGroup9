const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    excerpt: {
        type: String,
        trim: true,
        required: true
    },
    userId:{ 
        type: ObjectId,
        ref: "user",
        required: true
    },
     ISBN: {
        type: String,
        trim: true,
        unique: true,
        match: [/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/,'Please fill a valid ISBN no.'],
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    subCategory: {
        type: String,
        trim: true,
        required: true
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        format: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/ ,
        required:true
        
    },
}, {timestamps:true});



module.exports= mongoose.model('book',bookSchema)
