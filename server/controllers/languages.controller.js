const { default: slugify } = require("slugify");
const languagesModel = require("../models/languages.model");

const createLanguagesController = async (req, res) => {
    try {
        const {name, answer, slug, description, image, categoryLanguages, brandLanguages} = req.body;
        if (!name || !answer || !description || !image || !categoryLanguages || !brandLanguages) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        const newLanguage = {
            name: name.trim(),
            answer: answer.trim(),
            slug: slugify(name),
            description: description.trim(),
            image: image.trim(),
            categoryLanguages,
            brandLanguages
        };
        const language = await languagesModel.create(newLanguage);
        return res.status(201).json({
            success: true,
            message: 'Language created successfully',
            data: language
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating languages',
            error: error.message
        });
    }
}
const getAllLanguagesController = async (req, res) => {
    try {
        const languages = await languagesModel.find({})
            .populate('categoryLanguages', 'nameC')
            .populate('brandLanguages', 'nameBrand');
        return res.status(200).json({
            success: true,
            message: 'Languages fetched successfully',
            data: languages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching languages',
            error: error.message
        });
    }
}
const getLanguageBySlugController = async (req, res) => {
    try {
        const { slug } = req.params;
        const language = await languagesModel.findOne({ slug })
            .populate('categoryLanguages', 'nameC')
            .populate('brandLanguages', 'nameBrand');
        if (!language) {
            return res.status(404).json({
                success: false,
                message: 'Language not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Language fetched successfully',
            data: language
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching language',
            error: error.message
        });
    }
}
const updateLanguagesController = async (req, res) => {
    try {
        const { slug } = req.params;
        const { name, answer, description, image, categoryLanguages, brandLanguages } = req.body;
        if (!name || !answer || !description || !image || !categoryLanguages || !brandLanguages) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        const updatedLanguage = {
            name: name.trim(),
            answer: answer.trim(),
            slug: slugify(name),
            description: description.trim(),
            image: image.trim(),
            categoryLanguages,
            brandLanguages
        };
        const language = await languagesModel.findOneAndUpdate(
            { slug },
            updatedLanguage,
            { new: true }
        ).populate('categoryLanguages', 'nameC')
         .populate('brandLanguages', 'nameBrand');
        if (!language) {
            return res.status(404).json({
                success: false,
                message: 'Language not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Language updated successfully',
            data: language
        }
        )
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Loi khi cap nhat ngôn ngữ',
            error: error.message
        });
    }
}
const deleteLanguagesController = async (req, res) => {
    try {
        const { slug } = req.params;
        const language = await languagesModel.findOneAndDelete({ slug });
        if (!language) {
            return res.status(404).json({
                success: false,
                message: 'Language not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Language deleted successfully',
            data: language
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting language',
            error: error.message
        })
    }
}
 module.exports = {
        createLanguagesController,
        getAllLanguagesController,
        getLanguageBySlugController,
        updateLanguagesController,
        deleteLanguagesController
    }