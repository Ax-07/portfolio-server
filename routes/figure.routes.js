const express = require('express'); // Importation du module express
const router = express.Router(); // Création d'un routeur express
const multer = require('../middlewares/multer.config'); // Importation du middleware multer pour la gestion des fichiers
const figures = require('../controllers/figure.controller.js'); // Importation du contrôleur figure

router.post('/', multer, figures.create); // Création d'une nouvelle figure
router.get('/', figures.findAll); // Récupération de toutes les figures
router.get('/:id', figures.findById); // Récupération d'une figure par son id
router.put('/:id', multer, figures.update); // Mise à jour d'une figure par son id
router.delete('/:id', figures.delete); // Suppression d'une figure par son id

module.exports = router; // Exportation du routeur