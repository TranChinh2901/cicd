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
 module.exports ={
        createLanguagesController,
        getAllLanguagesController
    }