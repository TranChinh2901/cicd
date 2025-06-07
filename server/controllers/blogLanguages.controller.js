const blogLanguagesModel = require("../models/blogLanguages.model");

const createBlogLanguagesController = async (req, res) => {
    try {
        const {title, content, image} = req.body;
        if(!title || !content || !image){
            return res.status(400).json({
                success: false,
                message: 'Title, content, and image are required'
            })
        }
        const newBlogLanguage = {
            title: title.trim(),
            content: content.trim(),
            image: image.trim()
        };
        const blogLanguage = await blogLanguagesModel.create(newBlogLanguage);
        return res.status(201).json({
            success: true,
            message: 'Blog language created successfully',
            data: blogLanguage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating blog languages',
            error: error.message
        })
    }
}

module.exports = {
    createBlogLanguagesController
}