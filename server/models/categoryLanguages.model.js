const { mongoose } = require("mongoose")

const categoryLanguagesSchema = new mongoose.Schema({
    //create category schema
    nameC: {
        type: String,
        required: true,
        trim: true
    },  
    slug: {
        type: String,
        required: true,
        trim: true
    },
    imageC: {
        type: String,
        required: true,
    },
    descriptionC: {
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