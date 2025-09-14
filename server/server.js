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
require('dotenv').config();

const app = express();

// app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors({
     origin: '*'
}));
app.use(morgan('dev'))

connectDB();
    
const PORT = process.env.PORT || 3001;
app.use('/api/v1/auth/', usersRouter);
app.use('/api/v1/brand/', brandLanguagesRouter);
app.use('/api/v1/category/',categoryLanguagesRouter);
app.use('/api/v1/language/', languagesRouter);
app.use('/api/v1/blog/', blogLanguagesRouter)
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Network: http://YOUR_IP_ADDRESS:${PORT}`);
});