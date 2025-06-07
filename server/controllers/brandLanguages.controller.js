const { default: slugify } = require("slugify");
const brandLanguagesModel = require("../models/brandLanguages.model");

const createBrandLanguage = async (req, res) => {
    try {
        const {nameBrand, logoBrand} = req.body;
        if(!nameBrand || !logoBrand) {
            return res.status(400).json({
                success: false,
                message: 'Name and logo are required'
            })
        }
               const existingBrand = await brandLanguagesModel.findOne({ nameBrand });
               if(existingBrand) {
                return res.status(400).json({
                    success: false,
                    message: 'Brand da ton tai'
                })
               }
               const newBrand = await new brandLanguagesModel(
                {nameBrand, slug:slugify(nameBrand), logoBrand}
               ).save();
               return res.status(201).json({
                   success: true,
                   message: 'Tao brand language thanh cong',
                   data: newBrand
               })   
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Loi khi tạo brand language',
            error: error.message
        })
    }
}
const getBrandLanguages = async (req, res) => {
    try {
        const brandLanguages = await brandLanguagesModel.find({});
         res.status(200).json({
            success: true,
            message: 'Lay danh sach brand languages thanh cong',
            data: brandLanguages
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Loi khi lay danh sach brand languages',
            error: error.message
        })
    }
}
const getBrandLanguageBySlug = async (req, res) => {
    try {
        const {slug} = req.params;
        const brandLanguage = await brandLanguagesModel.findOne({slug});
        if(!brandLanguage) {
            return res.status(404).json({
                success: false,
                message: 'Brand language not found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Lay brand language thanh cong',
            data: brandLanguage
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Loi khi lay brand language',
            error: error.message
        })
    }
}
const updateBrandLanguage = async (req, res) => {
    try {
        const {slug} = req.params;
        const {nameBrand, logoBrand} = req.body;
        if(!nameBrand || !logoBrand) {
            return res.status(400).json({
                success: false,
                message: 'Name and logo are required'
            })
        }
        const brandLanguage = await brandLanguagesModel.findOneAndUpdate(
            {slug},
            {nameBrand, logoBrand, slug: slugify(nameBrand)},
            {new: true}
        );
        if(!brandLanguage) {
            return res.status(404).json({
                success: false,
                message: 'Brand language not found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Cap nhat brand language thanh cong',
            data: brandLanguage
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Loi khi cap nhat brand language',
            error: error.message
        })
    }
}
const deleteBrandLanguage = async (req, res) => {
    try {
        const {slug} = req.params;
        const deleteBrandLanguage = await brandLanguagesModel.findOneAndDelete({slug});
        if(!deleteBrandLanguage) {
            return res.status(404).json({
                success: false,
                message: 'Brand language not found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Xoa brand language thanh cong',
            data: deleteBrandLanguage
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Loi khi xoa brand language',
            error: error.message
        })
    }
}
const countBrandLanguages = async (req, res) => {
    try {
        const count = await brandLanguagesModel.countDocuments();
        return res.status(200).json({
            success: true,
            message: 'Count brand languages successfully',
            data: { count }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error counting brand languages',
            error: error.message
        });
    }
}
module.exports = {
    createBrandLanguage,
    getBrandLanguages,
    getBrandLanguageBySlug,
    updateBrandLanguage,
    deleteBrandLanguage,
    countBrandLanguages
};