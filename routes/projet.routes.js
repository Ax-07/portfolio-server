const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projet.controller');
const multer = require('../middlewares/multer.config'); // Importation du middleware multer pour la gestion des fichiers
// const { checkAdmin } = require('../middlewares/Auth.middleware');

router.get('/', projetController.getAllProjets);
router.get('/:id', projetController.getProjetById);
router.post('/', multer, projetController.createProjet);
router.put('/:id', multer, projetController.updateProjet);
router.delete('/:id', projetController.deleteProjet);

module.exports = router;

