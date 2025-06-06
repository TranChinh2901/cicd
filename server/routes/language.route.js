const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/middleware');
const { createLanguagesController, getAllLanguagesController } = require('../controllers/languages.controller');
const router = express.Router();
    router.post('/languages', requireSignIn, isAdmin, createLanguagesController);
    router.get('/languages', getAllLanguagesController)
module.exports = router;