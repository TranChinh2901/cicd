const { default: slugify } = require("slugify");
const categoryLanguagesModel = require("../models/categoryLanguages.model");

const createCategoryLanguageController = async (req, res) => {
    try {
        const { nameC, imageC, descriptionC, brandLanguages } = req.body;
        if (!nameC || !imageC || !descriptionC || !brandLanguages) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        const existingCategory = await categoryLanguagesModel.findOne({ nameC });
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
const getCategoryLanguagesController = async (req, res) => {
    try {
        const categoryLanguages = await categoryLanguagesModel.find({}).populate({
            path: 'brandLanguages',
            select: 'nameBrand'

        });
        return res.status(200).json({
            success: true,
            message: 'Category languages retrieved successfully',
            data: categoryLanguages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving category languages',
            error: error.message
        });
    }
}
const updateCategoryLanguageController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nameC, imageC, imageBannerC, descriptionC, brandLanguages } = req.body;

        if (!nameC || !imageC || !imageBannerC || !descriptionC || !brandLanguages) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const updatedCategory = await categoryLanguagesModel.findByIdAndUpdate(
            id,
            {
                nameC,
                slug: slugify(nameC, { lower: true }),
                imageC,
                descriptionC,
                brandLanguages
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category language not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Category language updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating category language',
            error: error.message
        })
    }
}
const deleteCategoryLanguageController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await categoryLanguagesModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category language not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Category language deleted successfully',
            data: deletedCategory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting category language',
            error: error.message
        })
    }
}
const getCategoryLanguagesBySlugController = async (req, res) => {
    try {
        const { slug } = req.params;

        const brandLanguagesModel = require("../models/brandLanguages.model");
        const brand = await brandLanguagesModel.findOne({ slug });

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy brand với slug này",
                categoryLanguages: null
            });
        }

        const categoryLanguages = await categoryLanguagesModel.find({
            brandLanguages: brand._id
        }).populate("brandLanguages");


        res.status(200).json({
            success: true,
            message: "Lấy danh mục theo slug thành công",
            categoryLanguages,
            brandName: brand.nameBrand
        });
    } catch (error) {
        console.log('Error in getCategoryLanguagesBySlugController:', error);
        return res.status(500).json({
            success: false,
            message: "Lỗi hàm lấy danh mục theo slug",
            error: error.message
        });
    }
}
const countCategoryLanguagesController = async (req, res) => {
    try {
        const count = await categoryLanguagesModel.countDocuments();
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
    createCategoryLanguageController,
    getCategoryLanguagesController,
    updateCategoryLanguageController,
    deleteCategoryLanguageController,
    getCategoryLanguagesBySlugController,
    countCategoryLanguagesController,
    // getCategoryById
}



