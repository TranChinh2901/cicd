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
                
                const updateData = {
                    name: name?.trim(),
                    answer: answer?.trim(),
                    description: description?.trim(),
                    image: image?.trim(),
                    categoryLanguages,
                    brandLanguages
                };
                
                if (name) {
                    updateData.slug = slugify(name);
                }
                
                const language = await languagesModel.findOneAndUpdate(
                    { slug },
                    updateData,
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
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error updating language',
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
                    message: 'Language deleted successfully'
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error deleting language',
                    error: error.message
                });
            }
        }

        const countLanguagesController = async (req, res) => {
            try {
                const count = await languagesModel.countDocuments();
                return res.status(200).json({
                    success: true,
                    message: 'Language count fetched successfully',
                    count
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error counting languages',
                    error: error.message
                });
            }
        }

        const getLanguagesBySlugCategoryController = async (req, res) => {
            try {
                const { slug } = req.params;
                const categoryLanguagesModel = require("../models/categoryLanguages.model");
                const category = await categoryLanguagesModel.findOne({ slug });
                if (!category) {
                    return res.status(404).json({
                        success: false,
                        message: 'Category not found'
                    });
                }
                const languages = await languagesModel.find({ categoryLanguages: category._id })
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
                    message: 'Error fetching languages by category',
                    error: error.message
                });
            }
        }

        const getLanguagesByCategoryController = async (req, res) => {
            try {
                const { brandId, categoryId } = req.params;
                
                const languages = await languagesModel.find({
                    brandLanguages: brandId,
                    categoryLanguages: categoryId
                })
                .populate('categoryLanguages', 'nameC descriptionC imageC slug')
                .populate('brandLanguages', 'nameBrand logoBrand slug');


                return res.status(200).json({
                    success: true,
                    message: `Tìm thấy ${languages.length} ngôn ngữ lập trình`,
                    data: {
                        languages
                    },
                    count: languages.length
                });
            } catch (error) {
                console.error('Error in getLanguagesByCategoryController:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error fetching languages by brand and category',
                    error: error.message
                });
            }
        };

        module.exports = {
            createLanguagesController,
            getAllLanguagesController,
            getLanguageBySlugController,
            updateLanguagesController,
            deleteLanguagesController,
            countLanguagesController,
            getLanguagesBySlugCategoryController,
            getLanguagesByCategoryController 
        }