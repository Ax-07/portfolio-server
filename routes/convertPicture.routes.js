const express = require('express');
const router = express.Router();
const imageMiddleware = require('../middlewares/convertPicture.config');
const { download } = require('../controllers/convertPicture.controller');
 
router.post('/convert', imageMiddleware);
router.get('/download/:format/:imageName', download);

module.exports = router;