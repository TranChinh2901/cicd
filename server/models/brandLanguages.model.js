const { mongoose } = require("mongoose");

const brandLanguagesSchema = new mongoose.Schema({
    nameBrand: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    logoBrand: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('BrandLanguages', brandLanguagesSchema);