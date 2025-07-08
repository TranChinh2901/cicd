const express = require('express');
const { createBrandLanguage, getBrandLanguages, getBrandLanguageBySlug, updateBrandLanguage, deleteBrandLanguage, countBrandLanguages } = require('../controllers/brandLanguages.controller');
const { requireSignIn, isAdmin } = require('../middlewares/middleware');
const router = express.Router();
    router.post('/brandLanguage', requireSignIn, isAdmin ,createBrandLanguage);
    router.get('/brandLanguages', getBrandLanguages);
    router.get('/brandLanguages/:slug', getBrandLanguageBySlug);
    router.put('/brandLanguages/:slug', requireSignIn, isAdmin, updateBrandLanguage);
    router.delete('/brandLanguages/:slug', requireSignIn, isAdmin, deleteBrandLanguage);
    router.get('/count-brandLanguages', countBrandLanguages)
module.exports = router