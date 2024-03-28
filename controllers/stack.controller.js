const db = require("../models"); // on recupère le fichier index.js du dossier model
const Stack = db.stack; // on recupère le model stack

// Création et enregistrement d'une nouvelle stack
exports.createStack = (req, res) => {
    // Validation de la requête
    if (!req.body.name) {
        res.status(400).json({ message: "Le contenu ne peut pas être vide !" });
        return;
    }
    // Création d'une stack
    const stack = {
        name: req.body.name
    };

    // verifie si la catégorie existe déjà
    Stack.findOne({ where: { name: req.body.name } })
        .then(data => {
            if (data) {
                res.status(400).json({ message: `La stack ${req.body.name} existe déjà.` });
            }
            else {
                // Sauvegarde de la stack dans la base de données si elle n'existe pas
                Stack.create(stack)
                    .then(data => {
                        console.log(data)
                        res.status(201).json(data);
                    })
                    .catch(err => {
                        res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la création de la stack." });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la création de la stack." });
        });
};

// Récupération de toutes les stacks de la base de données
exports.getAllStacks = (req, res) => {
    // Récupération de toutes les stacks de la base de données
    Stack.findAll()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la récupération des stacks." });
        });
};

// Récupération d'une stack par son id
exports.getStackById = (req, res) => {
    const id = req.params.id;
    // Récupération d'une stack par son id
    Stack.findByPk(id)
        .then(data => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ message: `Aucune stack trouvée avec l'id ${id}` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la récupération de la stack avec l'id ${id}` });
        });
};

// Mise à jour d'une stack par son id
exports.updateStack = (req, res) => {
    const id = req.params.id;
    // Validation de la requête
    if (!req.body.name) {
        res.status(400).json({ message: "Le contenu ne peut pas être vide !" });
        return;
    }
    // Mise à jour de la stack par son id
    Stack.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({ message: "La stack a été mise à jour avec succès." });
            } else {
                res.status(404).json({ message: `Impossible de mettre à jour la stack avec l'id ${id}. La stack n'a pas été trouvée ou le contenu est vide !` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la mise à jour de la stack avec l'id ${id}` });
        });
};

// Suppression d'une stack par son id
exports.deleteStack = (req, res) => {
    const id = req.params.id;
    // Suppression d'une stack par son id
    Stack.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({ message: "La stack a été supprimée avec succès !" });
            } else {
                res.status(404).json({ message: `Impossible de supprimer la stack avec l'id ${id}. La stack n'a pas été trouvée !` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la suppression de la stack avec l'id ${id}` });
        });
};