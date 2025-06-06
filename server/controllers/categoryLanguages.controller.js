const { default: slugify } = require("slugify");
const categoryLanguagesModel = require("../models/categoryLanguages.model");

const createCategoryLanguageController = async (req, res) => {
    try {   
        const {nameC, imageC, imageBannerC, descriptionC, brandLanguages} = req.body;
        if (!nameC || !imageC || !imageBannerC || !descriptionC || !brandLanguages) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        const existingCategory = await categoryLanguagesModel.findOne({nameC});
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }
        const slug = slugify(nameC, { lower: true });
        const newCategory = await new categoryLanguagesModel({
            nameC,
            slug,
            imageC,
            imageBannerC,
            descriptionC,
            brandLanguages
        }).save();
        return res.status(201).json({
            success: true,
            message: 'Category language created successfully',
            data: newCategory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating category language',
            error: error.message
        });
    }
}

module.exports = {
    createCategoryLanguageController
}



