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
const countLanguagesController = async (req, res) => {
    try {
        const count = await languagesModel.countDocuments();
        return res.status(200).json({
            success: true,
            message: 'Count languages successfully',
            data: { count }
        })  
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error counting languages',
            error: error.message
        });
    }
}
// ...existing code...

const getLanguagesByCategoryController = async (req, res) => {
    try {
        const { brandSlug, categoryId } = req.params;
        
        // Find brand by slug
        const BrandLanguages = require("../models/brandLanguages.model");
        const brand = await BrandLanguages.findOne({ slug: brandSlug });
        
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thương hiệu"
            });
        }

        // Find category by ID or slug
        const CategoryLanguages = require("../models/categoryLanguages.model");
        const category = await CategoryLanguages.findOne({
            $or: [
                { _id: categoryId },
                { slug: categoryId }
            ]
        });
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh mục"
            });
        }

        // Find languages by brand and category
        const Languages = require("../models/languages.model");
        const languages = await Languages.find({
            brandLanguages: brand._id,
            categoryLanguages: category._id
        })
        .populate('brandLanguages', 'nameBrand logoBrand slug')
        .populate('categoryLanguages', 'nameC imageC descriptionC slug')
        .sort({ createdAt: -1 }); // Sort by newest first

        return res.status(200).json({
            success: true,
            message: `Tìm thấy ${languages.length} ngôn ngữ lập trình`,
            data: {
                languages,
                brand: {
                    name: brand.nameBrand,
                    logo: brand.logoBrand,
                    slug: brand.slug
                },
                category: {
                    name: category.nameC,
                    image: category.imageC,
                    description: category.descriptionC,
                    slug: category.slug
                }
            },
            count: languages.length
        });
    } catch (error) {
        console.error("Error in getLanguagesByCategoryController:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách ngôn ngữ",
            error: error.message
        });
    }
};



// ...existing code...
 module.exports = {
        createLanguagesController,
        getAllLanguagesController,
        getLanguageBySlugController,
        updateLanguagesController,
        deleteLanguagesController,
        countLanguagesController,
        getLanguagesByCategoryController
    }