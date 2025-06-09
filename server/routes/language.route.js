const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/middleware');
const { createLanguagesController, getAllLanguagesController, getLanguageBySlugController, updateLanguagesController, deleteLanguagesController, countLanguagesController, getLanguagesByCategoryController } = require('../controllers/languages.controller');
const router = express.Router();
    router.post('/languages', requireSignIn, isAdmin, createLanguagesController);
    router.get('/languages', getAllLanguagesController);
    router.get('/languages/:slug', getLanguageBySlugController);
    router.put('/languages/:slug', requireSignIn, isAdmin,updateLanguagesController);
    router.delete('/languages/:slug', requireSignIn, isAdmin, deleteLanguagesController);
    router.get('/count-languages', countLanguagesController)
    router.get('/category/:brandSlug/:categoryId', getLanguagesByCategoryController);
module.exports = router;