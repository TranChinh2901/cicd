    const express = require('express');
    const { requireSignIn, isAdmin } = require('../middlewares/middleware');
    const { createLanguagesController, getAllLanguagesController, getLanguageBySlugController, updateLanguagesController, deleteLanguagesController, countLanguagesController, getLanguagesByCategoryController, getLanguagesBySlugCategoryController } = require('../controllers/languages.controller');
    const router = express.Router();

    router.post('/languages', requireSignIn, isAdmin, createLanguagesController);
    router.get('/languages', getAllLanguagesController);
    router.get('/languages/:slug', getLanguageBySlugController);
    router.put('/languages/:slug', requireSignIn, isAdmin, updateLanguagesController);
    router.delete('/languages/:slug', requireSignIn, isAdmin, deleteLanguagesController);
    router.get('/count-languages', countLanguagesController);
    // THÊM route mới cho filter theo brand + category
    router.get('/category/:brandId/:categoryId', getLanguagesByCategoryController);
    router.get('/languages/by-category/:slug', getLanguagesBySlugCategoryController);

    module.exports = router;