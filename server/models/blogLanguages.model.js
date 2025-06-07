const mongoose = require('mongoose');
const blogLanguagesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },  
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('BlogLanguages', blogLanguagesSchema); 