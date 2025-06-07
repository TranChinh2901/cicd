const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
        });

        console.log('Kết nối MongoDB thành công');
    } catch (error) {
        console.error(`Kết nối MongoDB thất bại: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;