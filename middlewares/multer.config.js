// Importation du module multer pour la gestion des fichiers entrants dans les requêtes HTTP
const multer = require('multer');

// Importation du module sharp pour la modification des tailles et formats des images
const sharp = require('sharp');

// Importation du module path pour la gestion des chemins de fichiers/dossiers
const path = require('path');

// Importation de la fonction formatDate depuis le fichier utils/formatDate
const { formatDate } = require('../utils/formatDate');

// Définition des types MIME pour déterminer le format des images
const MIME_TYPES = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
};

// Utilisation de multer avec la configuration de stockage définie
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // Limite à 15MB
    }
}).any();

const DESKTOP_SIZE = 1280;
const TABLET_SIZE = 768;
const MOBILE_SIZE = 375;
const IMAGE_QUALITY = 80;

// Fonction pour redimensionner et convertir une image en WebP avec une qualité donnée et un préfixe spécifique pour le nom du fichier (desktop, tablet, mobile)
const processImage = async (file, size, prefix) => {
    const imagePath = `${prefix}-${file.originalname.split('.').slice(0, -1).join('_')}.webp`; // Nom du fichier
    await sharp(file.buffer)
        .resize(size) // Redimensionne l'image à la taille spécifiée (desktop, tablet, mobile)
        .webp({ quality: IMAGE_QUALITY }) // Convertit l'image en WebP avec une qualité de 80%
        .toFile(path.join(__dirname, '..', 'public', 'images', imagePath)); // Enregistre l'image dans le dossier public/images
    return imagePath; // Retourne le nom du fichier
}
// Exportation d'un middleware qui gère l'upload des fichiers et les erreurs potentielles
module.exports = (req, res, next) => {
    upload(req, res, async function (err) {
        // Gestion des erreurs
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
        // Création de l'URL de base pour les fichiers
        const host = req.protocol + '://' + req.get('host');
        // Stockage des informations sur les fichiers dans res.locals
        console.log(req.files);
        try {
            if (req.files) {
                res.locals.files = await Promise.all(req.files.map(async (file, index) => {
                    const desktopImagePath = await processImage(file, DESKTOP_SIZE, 'desktop');
                    const tabletImagePath = await processImage(file, TABLET_SIZE, 'tablet');
                    const mobileImagePath = await processImage(file, MOBILE_SIZE, 'mobile');

                    return {
                        image: {
                            desktop: host + '/images/' + desktopImagePath,
                            tablet: host + '/images/' + tabletImagePath,
                            mobile: host + '/images/' + mobileImagePath,
                        },
                        alt: req.body[`alt${index}`]
                    }; // Retourne un objet avec les URLs des différentes versions de l'image
                }));
            }
        } catch (error) {
            console.log(error);
        }

        // Affichage des informations sur les fichiers dans la console
        console.log(res.locals.files);
        // Passage au middleware suivant
        next(); // Appel du middleware suivant
    });
};