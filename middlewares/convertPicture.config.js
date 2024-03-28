const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const upload = multer({
    storage: multer.memoryStorage(), 
    limits: {
        fileSize: 15 * 1024 * 1024, // Limite à 15MB
    }
}).any();

const DESKTOP_SIZE = 1280;
const TABLET_SIZE = 768;
const MOBILE_SIZE = 375;
const IMAGE_QUALITY = 80;

const processImage = async (file, size) => {
    const buffer = await sharp(file.buffer)
        .resize(size)
        .webp({ quality: IMAGE_QUALITY })
        .toBuffer();
    return buffer;
}

module.exports = (req, res, next) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }

        try {
            if (req.files) {
                res.locals.files = await Promise.all(req.files.map(async file => {
                    const desktopImage = await processImage(file, DESKTOP_SIZE);
                    const tabletImage = await processImage(file, TABLET_SIZE);
                    const mobileImage = await processImage(file, MOBILE_SIZE);

                    const baseName = path.parse(file.originalname).name;

                    return {
                        desktop: {
                            buffer: desktopImage,
                            originalname: `desktop-${baseName}.webp`,
                            mimetype: 'image/webp',
                        },
                        tablet: {
                            buffer: tabletImage,
                            originalname: `tablet-${baseName}.webp`,
                            mimetype: 'image/webp'
                        },
                        mobile: {
                            buffer: mobileImage,
                            originalname: `mobile-${baseName}.webp`,
                            mimetype: 'image/webp'
                        }
                    };
                }));
            }
        } catch (error) {
            console.log(error);
        }

        console.log(res.locals.files);
        res.json(res.locals.files);
    });
};