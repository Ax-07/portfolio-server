// Importation du module multer pour la gestion des fichiers entrants dans les requêtes HTTP
const multer = require('multer');

// Importation du module sharp pour la modification des tailles et formats des images
const sharp = require('sharp');

// Importation du module path pour la gestion des chemins de fichiers/dossiers
const path = require('path');

// Importation de la fonction formatDate depuis le fichier utils/formatDate
const { formatDate } = require('../utils/formatDate');
const {put} = require('@vercel/blob');

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
const IMAGE_QUALITY = 90;

// Fonction pour redimensionner et convertir une image en WebP avec une qualité donnée et un préfixe spécifique pour le nom du fichier (desktop, tablet, mobile)
const processImage = async (file, size, prefix) => {
    const imagePath = `${prefix}-${file.originalname.split('.').slice(0, -1).join('_')}.webp`; // Nom du fichier
    const imageBuffer = await sharp(file.buffer)
        .resize(size) // Redimensionne l'image à la taille spécifiée (desktop, tablet, mobile)
        .webp({ quality: IMAGE_QUALITY }) // Convertit l'image en WebP avec une qualité de 80%
        .toBuffer(); // Convertit l'image en buffer

    // Envoie l'image à Vercel
    const blob = await put(imagePath, imageBuffer, { access: 'public' });

    return blob.url; // Retourne l'URL de l'image sur Vercel
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
                    const desktopImageUrl = await processImage(file, DESKTOP_SIZE, 'desktop');
                    const tabletImageUrl = await processImage(file, TABLET_SIZE, 'tablet');
                    const mobileImageUrl = await processImage(file, MOBILE_SIZE, 'mobile');
                    
                    return {
                        image: {
                            desktop: desktopImageUrl,
                            tablet: tabletImageUrl,
                            mobile: mobileImageUrl,
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