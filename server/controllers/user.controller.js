const userModel = require("../models/user.model");

const registerController = async (req, res) => {
    try {
          const { name, email, password, phone, address, gender } = req.body;
        if (!name) {
            return res.send({ error: 'Hãy nhập tên' })
        };
        if (!email) {
            return res.send({ message: 'Hãy nhập email' })
        }
        if (!password) {
            return res.send({ message: 'Hãy nhập password ' })
        }
        if (!phone) {
            return res.send({ message: 'hãy nhập sdt' })
        }
        if (!address) {
            return res.send({ message: 'Hãy nhập địa chỉ' })
        }
        if (!gender) {
            return res.send({ message: 'Hãy nhập gender' })
        }
        const exisUser = await userModel.findOne({email});
        if (exisUser) {
            return res.status(200).send({
                success: false,
                message: 'Người dùng đã tồn tại',
            })
        }
        
    } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Loi khi dang ky tai khoan',
        error: error.message
    })
    }
}