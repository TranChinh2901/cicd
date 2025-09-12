    // require("dotenv").config();
    // const { GoogleGenerativeAI } = require("@google/generative-ai");
    // const brandLanguagesModel = require("../models/brandLanguages.model");

    // const genAI = new GoogleGenerativeAI(process.env.CHATBOT_API_KEY)
    // const model = genAI.getGenerativeModel({
    //     //3 phiên bản mạnh nhất của gemini (recommend dùng model: gemini-2.0-flash) vì phản hồi nhanh
    //     // 2 phiên bản còn lại có chế độ thinking nên nó phải chờ suy nghĩ trước khi đưa ra kết quảquả

    //     // model: "gemini-2.5-flash-preview-04-17"
    //     // model: "gemini-2.5-pro-exp-03-25"
    //     model: "gemini-2.0-flash"
    // });

    // async function chatbot(question) {
    //     try {
    //         const brands = await brandLanguagesModel.find({}).lean();
            
    //         const brandData = brands.map(
    //             (item) => `ID: ${item._id}, Tên ngôn ngữ: ${item.nameBrand}, Logo: ${item.logoBrand}'}`
    //         ).join('\n');

    //         const prompt = `
    // Bạn là một trợ lý thông minh chuyên nghiệp trong website blog này, đây là những gì mình có trong kho dữ liệu:
    // ${brandData}

    // Câu hỏi của người dùng: ${question}
    // Hãy trả lời một cách tự nhiên và thân thiện.
    // Lưu ý trả lời phải có dấu câu và ngữ điệu tự nhiên như một con người.
    // Nếu bạn đề cập đến một ngôn ngữ cụ thể từ danh sách trên, hãy trình bày thông tin ngôn ngữ đó bằng cách sử dụng định dạng SAU (có thể thêm giải thích chú thích nếu cần):
    // ITEM_START
    // ID: [ID của ngôn ngữ]
    // Tên: [Tên ngôn ngữ]
    // Logo: [logo]

    // ITEM_END
    // `;
    //         const result = await model.generateContent(prompt);
    //         const response = await result.response;
    //         const answer = response.text();
    //         return answer;

    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).send({
    //             success: false,
    //             message: 'Loi roi !!!'
    //         })
    //     }
    // }

    // exports.chatbot = chatbot

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const brandLanguagesModel = require("../models/brandLanguages.model");
const categoryLanguagesModel = require("../models/categoryLanguages.model");
const languagesModel = require("../models/languages.model");

const genAI = new GoogleGenerativeAI(process.env.CHATBOT_API_KEY);
const model = genAI.getGenerativeModel({
    // model: "gemini-2.5-flash-preview-04-17"
    model: "gemini-2.5-flash"
    // model: "gemini-2.5-pro-preview-06-05"
});

async function chatbot(question) {
    try {
        if (!process.env.CHATBOT_API_KEY) {
            throw new Error("CHATBOT_API_KEY không được cấu hình");
        }

        console.log("Fetching data from database...");
        const [brands, categories, languages] = await Promise.all([
            brandLanguagesModel.find({}).lean(),
            categoryLanguagesModel.find({}).lean(),
            languagesModel.find({}).lean(),
        ]);

        console.log(`Data fetched: ${brands.length} brands, ${categories.length} categories, ${languages.length} languages`);

        const brandData = brands.map(
            (item) => `ID: ${item._id}, Tên ngôn ngữ: ${item.nameBrand}` 
        ).join('\n');
        const categoryData = categories.map(
            (item) => `ID: ${item._id}, Tên danh mục: ${item.nameCategory || item.nameC}` 
        ).join('\n');
        const languageData = languages.map(
            (item) => `ID: ${item._id}, Tên bài học: ${item.name}`
        ).join('\n');

         const prompt = `
Bạn là một trợ lý thông minh chuyên nghiệp của website blog lập trình.
Hãy trả lời câu hỏi của người dùng. Nếu câu hỏi liên quan đến dữ liệu bạn có, hãy đưa ra thông tin cụ thể.

## Dữ liệu Ngôn ngữ Lập trình (Brands):
${brandData}

## Dữ liệu Danh mục:
${categoryData}

## Dữ liệu Bài học:
${languageData}

Câu hỏi của người dùng: "${question}"

Hướng dẫn trả lời:
1. Trả lời một cách tự nhiên và thân thiện như một chuyên gia lập trình.
2. Sử dụng dấu câu và ngữ điệu tự nhiên.
3. Nếu bạn trả lời về một mục cụ thể (Brand, Category, Language), hãy sử dụng định dạng sau để người dùng có thể click vào:

ITEM_START
--------------------------------------
Loại: [Ngôn ngữ lập trình/Danh mục/Bài học]
Tên/Tiêu đề: [Tên của mục]
Mô tả: [Mô tả chi tiết nếu có và liên quan đến câu hỏi]
Hình ảnh: [Hình ảnh nếu có]
Logo: [Logo nếu có và liên quan đến câu hỏi]
Phụ đề: [Phụ đề nếu có và liên quan đến câu hỏi]
--------------------------------------
ITEM_END
Lưu ý: Nếu có thì phải bắt đầu bằng dấu -
Lưu ý: Chỉ đưa ra các trường dữ liệu  Mô tả, Hình ảnh, Logo, Phụ đề,  Tóm tắt, Vai trò NẾU CHÚNG THỰC SỰ LIÊN QUAN VÀ ĐƯỢC HỎI CỤ THỂ. KHÔNG NHỒI NHÉT TẤT CẢ DỮ LIỆU vào mỗi câu trả lời 
Lưu ý: câu trả lời không bao gồm ITEM_START và END_START.
`;

        console.log("Sending request to Gemini...");
        const promptLength = prompt.length; 
        console.log(`Prompt length: ${promptLength} characters.`);
        if (promptLength > 5000) { 
            console.warn("Prompt is very long, might exceed token limits.");
        }
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();
        console.log("Received response from Gemini");
        return answer;
    } catch (error) {
        console.error("Error in chatbot function:", error);
        if (error.message.includes("API key")) {
            throw new Error("Lỗi cấu hình API key Google Gemini. Vui lòng kiểm tra lại khóa API.");
        } else if (error.message.includes("quota") || error.status === 429) { 
            throw new Error("Đã vượt quá giới hạn sử dụng (quota) API Google Gemini. Vui lòng thử lại sau hoặc kiểm tra tài khoản của bạn.");
        } else if (error.message.includes("network")) {
            throw new Error("Lỗi kết nối mạng với Google Gemini. Vui lòng kiểm tra kết nối internet của bạn.");
        } else {
            throw new Error(`Lỗi chatbot: ${error.message}.`);
        }
    }
}

module.exports = { chatbot };