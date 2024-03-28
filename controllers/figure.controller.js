const db = require('./../models'); // on recupère le fichier index.js du dossier model
const Figure = db.figure; // on recupère le model figure
const fs = require('fs'); // on recupère le module fs de node pour acceder au systeme de fichier 
const path = require('path'); // on recupère le module path de node pour acceder au chemin du fichier
const { Op } = require('sequelize'); // on recupère l'operateur de sequelize pour les requetes du fichier index.js du dossier model

// Création et enregistrement d'une nouvelle figure
exports.create = (req, res) => {
    // Validation de la requête
    if (!req.body.category) {
        res.status(400).json({ message: "Le contenu ne peut pas être vide !" });
        return;
    }
    // Création d'une figure
    const figure = {
        category: req.body.category,
        description: req.body.description,
        image: res.locals.files,
        video: req.body.video
    };
    // Sauvegarde de la figure dans la base de données
    Figure.create(figure)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la création de la figure." });
        });
};

// Récupération de toutes les figures de la base de données
exports.findAll = (req, res) => {
    // Récupération de toutes les figures de la base de données
    Figure.findAll()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la récupération des figures." });
        });
};

// Récupération d'une figure par son id
exports.findById = (req, res) => {
    const id = req.params.id;
    // Récupération d'une figure par son id
    Figure.findByPk(id)
        .then(data => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ message: `Aucune figure trouvée avec l'id ${id}` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la récupération de la figure avec l'id ${id}` });
        });
};

// Mise à jour d'une figure par son id
exports.update = (req, res) => {
    const id = req.params.id;
    Figure.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({ message: `La figure avec l'id ${id} a été mise à jour avec succès.` });
            } else {
                res.status(404).json({ message: `Impossible de mettre à jour la figure avec l'id ${id}. La figure n'a peut-être pas été trouvée ou le corps de la requête est vide.` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la mise à jour de la figure avec l'id ${id}` });
        });
};

// Suppression d'une figure par son id
exports.delete = (req, res) => {
    const id = req.params.id;
    Figure.findByPk(id)
        .then(data => {
            if (data) {
                if (data.imageUrl) {
                    fs.unlink(path.join(__dirname, `../static/${data.imageUrl}`), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                }
                if (data.videoUrl) {
                    fs.unlink(path.join(__dirname, `../static/${data.videoUrl}`), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                }
                Figure.destroy({
                    where: { id: id }
                })
                    .then(num => {
                        if (num == 1) {
                            res.json({ message: `La figure avec l'id ${id} a été supprimée avec succès.` });
                        } else {
                            res.status(404).json({ message: `Impossible de supprimer la figure avec l'id ${id}. La figure n'a peut-être pas été trouvée.` });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la suppression de la figure avec l'id ${id}` });
                    });
            } else {
                res.status(404).json({ message: `Aucune figure trouvée avec l'id ${id}` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la récupération de la figure avec l'id ${id}` });
        });
};