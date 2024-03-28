const db = require("../models"); // on recupère le fichier index.js du dossier model
const Categorie = db.categorie; // on recupère le model categorie

// Création et enregistrement d'une nouvelle catégorie
exports.createCategorie = (req, res) => {
    // Validation de la requête
    if (!req.body.name) {
        res.status(400).json({ message: "Le contenu ne peut pas être vide !" });
        return;
    }
    // Création d'une catégorie
    const categorie = {
        name: req.body.name
    };
    // verifie si la catégorie existe déjà
    Categorie.findOne({ where: { name: req.body.name } })
        .then(data => {
            if (data) {
                res.status(400).json({ message: `La catégorie ${req.body.name} existe déjà.` });
            } else {
                // Sauvegarde de la catégorie dans la base de données si elle n'existe pas
                Categorie.create(categorie)
                    .then(data => {
                        res.status(201).json(data);
                    })
                    .catch(err => {
                        res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la création de la catégorie." });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la création de la catégorie." });
        });
};

// Récupération de toutes les catégories de la base de données
exports.getAllCategories = (req, res) => {
    // Récupération de toutes les catégories de la base de données
    Categorie.findAll()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la récupération des catégories." });
        });
};

// Récupération d'une catégorie par son id
exports.getCategorieById = (req, res) => {
    const id = req.params.id;
    // Récupération d'une catégorie par son id
    Categorie.findByPk(id)
        .then(data => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ message: `Aucune catégorie trouvée avec l'id ${id}` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la récupération de la catégorie avec l'id ${id}` });
        });
};

// Mise à jour d'une catégorie par son id
exports.updateCategorie = (req, res) => {
    const id = req.params.id;
    // Validation de la requête
    if (!req.body.name) {
        res.status(400).json({ message: "Le contenu ne peut pas être vide !" });
        return;
    }
    // Mise à jour de la catégorie par son id
    Categorie.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({ message: "La catégorie a été mise à jour avec succès." });
            } else {
                res.status(404).json({ message: `Aucune catégorie trouvée avec l'id ${id}` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la mise à jour de la catégorie avec l'id ${id}` });
        });
};

// Suppression d'une catégorie par son id
exports.deleteCategorie = (req, res) => {
    const id = req.params.id;
    // Suppression de la catégorie par son id
    Categorie.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({ message: "La catégorie a été supprimée avec succès." });
            } else {
                res.status(404).json({ message: `Aucune catégorie trouvée avec l'id ${id}` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la suppression de la catégorie avec l'id ${id}` });
        });
};
