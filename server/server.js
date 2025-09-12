const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const usersRouter = require('./routes/auth.route');
const brandLanguagesRouter = require('./routes/brandLanguages.route')
const categoryLanguagesRouter = require('./routes/categoryLanguages.route');
const languagesRouter = require('./routes/language.route')
const blogLanguagesRouter = require('./routes/blogLanguages.route');
const { chatbot } = require('./utils/Integrate_chatbot');
require('dotenv').config();

const app = express();

// app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors({
    origin: '*'
}));
app.use(morgan('dev'))

connectDB();

const PORT = process.env.PORT || 3001;
app.use('/api/v1/auth/', usersRouter);
app.use('/api/v1/brand/', brandLanguagesRouter);
app.use('/api/v1/category/', categoryLanguagesRouter);
app.use('/api/v1/language/', languagesRouter);
app.use('/api/v1/blog/', blogLanguagesRouter)
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.post('/api/chatbot', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Câu hỏi không được để trống'
            });
        }

        console.log('Received question:', question);
        const answer = await chatbot(question.trim());
        console.log('Chatbot response received');

        return res.status(200).json({
            success: true,
            answer: answer
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Lỗi xử lý chatbot',
            error: error.message
        });
    }
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Network: http://YOUR_IP_ADDRESS:${PORT}`);
});