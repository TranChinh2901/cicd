const { mongoose } = require("mongoose")

const categoryLanguagesSchema = new mongoose.Schema({
    //create category schema
    name: {
        type: String,
        required: true,
        trim: true
    },  
    slug: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
    },
    imageBanner: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    brandLanguages: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BrandLanguages',
        required: true
    }
}, { timestamps: true })
module.exports = mongoose.model('CategoryLanguages', categoryLanguagesSchema)