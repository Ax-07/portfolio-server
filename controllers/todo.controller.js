const db = require('./../models'); // on recupère le fichier index.js du dossier model
const Todo = db.todos; // on recupère le model todo
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Création et enregistrement d'une nouvelle tâche
exports.create = (req, res) => {
    // Validation de la requête
    if (!req.body.title) {
        res.status(400).json({ message: "Le contenu ne peut pas être vide !" });
        return;
    }
    // Création d'une tâche
    const todo = {
        title: req.body.title,
        description: req.body.description,
        images: res.locals.files,
        status: req.body.status ? req.body.status : false
    };
    // Sauvegarde de la tâche dans la base de données
    Todo.create(todo)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la création de la tâche." });
        });
};

// Récupération de toutes les tâches de la base de données
exports.findAll = (req, res) => {
    // Récupération de toutes les tâches de la base de données
    Todo.findAll()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la récupération des tâches." });
        });
};

// Récupération d'une tâche par son id
exports.findById = (req, res) => {
    const id = req.params.id;
    // Récupération d'une tâche par son id
    Todo.findByPk(id)
        .then(data => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ message: `Aucune tâche trouvée avec l'id ${id}` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la récupération de la tâche avec l'id ${id}` });
        });
};

// Mise à jour d'une tâche par son id
exports.update = (req, res) => {
    const id = req.params.id;
    // Mise à jour de la tâche
    Todo.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({ message: "La tâche a été mise à jour avec succès." });
            } else {
                res.status(404).json({ message: `Impossible de mettre à jour la tâche avec l'id ${id}. La tâche n'a pas été trouvée ou le contenu est vide !` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la mise à jour de la tâche avec l'id ${id}` });
        });
};

// Suppression d'une tâche par son id
exports.delete = async (req, res) => {
    const id = req.params.id;
    // Trouver la tâche
    const todo = await Todo.findOne({ where: { id: id } });
    if (!todo) {
        return res.status(404).json({ message: `Impossible de supprimer la tâche avec l'id ${id}. La tâche n'a pas été trouvée !` });
    }

    // Supprimer les images
    for (let image of todo.images) {
        for (let type of ['desktop', 'mobile', 'tablet']) {
            const url = new URL(image[type]);
            const filename = path.basename(url.pathname);
            const imagePath = path.join(__dirname, '..', 'public', 'images', filename);
            const isImageUsedElsewhere = await Todo.findOne({ where: { images: { [Op.like]: '%' + filename + '%' }, id: { [Op.ne]: id } } });
            if (!isImageUsedElsewhere && fs.existsSync(imagePath)) {
                fs.unlink(imagePath, err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        }
    }

    // Suppression de la tâche
    Todo.destroy({where: { id: id }})
        .then(num => {
            if (num == 1) {
                res.json({ message: "La tâche a été supprimée avec succès." });
            } else {
                res.status(404).json({ message: `Impossible de supprimer la tâche avec l'id ${id}. La tâche n'a pas été trouvée !` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la suppression de la tâche avec l'id ${id}` });
        });
};