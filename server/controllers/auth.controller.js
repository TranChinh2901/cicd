const { hashPassword, comparePassword } = require("../helpers/helper");
const userModel = require("../models/auth.model");
const JWT = require('jsonwebtoken');

const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, gender } = req.body;
        if (!name || !email || !password || !phone || !address || !gender) {
            return res.status(400).json({
                success: false,
                message: 'Bắt buộc phải nhập đầy đủ thông tin'
            })
        }
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: 'Đã đăng ký vui lòng đăng nhập'
            })
        }
        const hashedPassword = await hashPassword(password);
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            gender
        }).save();
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            user_success: user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error in registerController",
            success: false,
            error: error.message
        })
    }
}
const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Bắt buộc phải nhập đầy đủ thông tin'
            })
        }
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            })
        }
        const soSanhMatKhau = await comparePassword(password, user.password);
        if(!soSanhMatKhau) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu không đúng'
            })
        }
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "10d" });
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            user_success: user,
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in loginController",
            success: false,
            error: error.message
        })
    }
}

const getUserController = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách người dùng thành công',
            users: users
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in getUserController",
            success: false,
            error: error.message
        })
    }
}

module.exports = {
    registerController,
    loginController,
    getUserController
};