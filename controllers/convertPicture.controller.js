module.exports.download = (req, res) => {
    const format = req.params.format;
    const imageName = req.params.imageName;

    // console.log('res.locals.files:', res.locals.files);
    console.log('format:', format);
    console.log('imageName:', imageName);

    const file = res.locals.files.find(file => 
        file[format] && file[format].originalname === imageName
    );

    if (file) {
        res.set({
            'Content-Type': file[format].mimetype,
            'Content-Disposition': 'attachment; filename=' + file[format].originalname
        });
        res.send(file[format].buffer);
    } else {
        res.status(404).send({
            message: "Image non trouvée."
        });
    }
};