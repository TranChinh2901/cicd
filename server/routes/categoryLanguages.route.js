const express = require('express');
const { createCategoryLanguageController, getCategoryLanguagesController, updateCategoryLanguageController, deleteCategoryLanguageController, getCategoryLanguagesBySlugController } = require('../controllers/categoryLanguages.controller');
const { isAdmin, requireSignIn } = require('../middlewares/middleware');
const router = express.Router();
    router.post('/categoryLanguage', requireSignIn, isAdmin, createCategoryLanguageController);
    router.get('/categoryLanguages', getCategoryLanguagesController);
    router.put('/categoryLanguages/:id', requireSignIn, isAdmin, updateCategoryLanguageController);
    router.delete('/categoryLanguages/:id', requireSignIn, isAdmin, deleteCategoryLanguageController);
    router.get('/categoryLanguages/:slug', getCategoryLanguagesBySlugController); 
module.exports = router;

