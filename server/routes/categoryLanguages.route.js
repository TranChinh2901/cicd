const express = require('express');
const { createCategoryLanguageController } = require('../controllers/categoryLanguages.controller');
const { isAdmin, requireSignIn } = require('../middlewares/middleware');
const router = express.Router();
    router.post('/categoryLanguage', requireSignIn, isAdmin, createCategoryLanguageController);
module.exports = router;

