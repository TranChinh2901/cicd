const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/middleware');
const { createLanguagesController } = require('../controllers/languages.controller');
const router = express.Router();
    router.post('/languages', requireSignIn, isAdmin, createLanguagesController);
module.exports = router;