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
            title,
            content,
            image
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
const getAllBlogLanguagesController = async (req, res) => {
    try {
        const blogLanguages = await blogLanguagesModel.find({});
        return res.status(200).json({
            success: true,
            message: 'Blog languages fetched successfully',
            data: blogLanguages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching blog languages',
            error: error.message
        })
    }
}
const getBlogLanguageByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const blogLanguage = await blogLanguagesModel.findById(id);
        if (!blogLanguage) {
            return res.status(404).json({
                success: false,
                message: 'Blog language not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Blog language fetched successfully',
            data: blogLanguage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching blog language',
            error: error.message
        });
    }
}
const updateBlogLanguagesController = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, content, image} = req.body;
        if(!title || !content || !image){
            return res.status(400).json({
                success: false,
                message: 'Title, content, and image are required'
            });
        }
        const updatedBlogLanguage = {
            title: title.trim(),
            content: content.trim(),
            image: image.trim()
        };
        const blogLanguage = await blogLanguagesModel.findByIdAndUpdate(id, updatedBlogLanguage, { new: true });
        if (!blogLanguage) {
            return res.status(404).json({
                success: false,
                message: 'Blog language not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Blog language updated successfully',
            data: blogLanguage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating blog language',
            error: error.message
        });
    }
}
const deleteBlogLanguagesController = async (req, res) => {
    try {
        const {id} = req.params;
        const blogLanguage = await blogLanguagesModel.findByIdAndDelete(id);
        if (!blogLanguage) {
            return res.status(404).json({
                success: false,
                message: 'Blog language not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Blog language deleted successfully',
            data: blogLanguage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting blog language',
            error: error.message
        });
    }
}
const countBlogLanguagesController = async (req,res) => {
    try {
        const count = await blogLanguagesModel.countDocuments();
        return res.status(200).json({
            success: true,
            message: 'Count fetched successfully',
            data: count
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching count',
            error: error.message
        });
    }
}
module.exports = {
    createBlogLanguagesController,
    getAllBlogLanguagesController,
    getBlogLanguageByIdController,
    updateBlogLanguagesController,
    deleteBlogLanguagesController,
    countBlogLanguagesController
}