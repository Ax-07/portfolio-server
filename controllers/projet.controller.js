const db = require("../models"); // on recupère le fichier index.js du dossier model
const Projet = db.projet; // on recupère le model projet
const fs = require('fs'); // Importation du module fs pour gérer les fichiers
const path = require('path'); // Importation du module path pour gérer les chemins de fichiers
const { Op } = require('sequelize'); // Importation de l'opérateur Sequelize pour les opérations de comparaison
const { del } = require('@vercel/blob'); // Importation de la fonction del depuis le module @vercel/blob
// Création et enregistrement d'un nouveau projet
exports.createProjet = (req, res) => {
    // Validation de la requête
    if (!req.body.title) {
        res.status(400).json({ message: "Le contenu ne peut pas être vide !" });
        return;
    }
    // Création d'un projet
    const projet = {
        title: req.body.title,
        categorie: req.body.categorie,
        description: req.body.description,
        image: res.locals.files,
        fonctionnalite: req.body.fonctionnalite,
        stack: req.body.stack,
        githubRepository: req.body.githubRepository,
        website: req.body.website
    };
    // Sauvegarde du projet dans la base de données
    Projet.create(projet)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la création du projet." });
        });
};

// Récupération de tous les projets de la base de données
exports.getAllProjets = (req, res) => {
    // Récupération de tous les projets de la base de données
    Projet.findAll()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message || "Une erreur s'est produite lors de la récupération des projets." });
        });
};

// Récupération d'un projet par son id
exports.getProjetById = (req, res) => {
    const id = req.params.id;
    // Récupération d'un projet par son id
    Projet.findByPk(id)
        .then(data => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ message: `Aucun projet trouvé avec l'id ${id}` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la récupération du projet avec l'id ${id}` });
        });
};

// Mise à jour d'un projet par son id
exports.updateProjet = (req, res) => {
    const id = req.params.id;

    console.log(req.body);
    // Mise à jour du projet
    Projet.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).json({ message: "Le projet a été mis à jour avec succès." });
            } else {
                res.status(404).json({ message: `Impossible de mettre à jour le projet avec l'id ${id}. Le projet n'a pas été trouvé ou le corps de la requête est vide !` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la mise à jour du projet avec l'id ${id}` });
        });
};

// Suppression d'un projet par son id
exports.deleteProjet = async (req, res) => {
    const id = req.params.id;
    // Trouver le projet
    const projet = await Projet.findOne({ where: { id: id } });
    if (!projet) {
        res.status(404).json({ message: `Impossible de supprimer le projet avec l'id ${id}. Le projet n'a pas été trouvé !` });
        return;
    }
    // Supprimer les images
    // Vérifier si project.image est défini et est un tableau
    if (projet.image && Array.isArray(projet.image)) {
        // Parcourir toutes les images du projet
        for (let image of projet.image) {
            // Parcourir tous les types d'images (desktop, mobile, tablette)
            for (let type of ['desktop', 'mobile', 'tablet']) {
                // Créer une nouvelle URL à partir de l'URL de l'image
                const url = new URL(image.image[type]);
                // Extraire le nom du fichier de l'URL de l'image
                const filename = path.basename(url.pathname);
                // Initialiser un indicateur pour vérifier si l'image est utilisée ailleurs
                let isImageUsedElsewhere = false;
                // Récupérer tous les projets sauf celui que nous supprimons
                const allProjects = await Projet.findAll({ where: { id: { [Op.ne]: id } } });
                // Parcourir tous les projets
                for (let project of allProjects) {
                    // Parcourir toutes les images du projet
                    for (let projectImage of project.image) {
                        // Créer une nouvelle URL à partir de l'URL de l'image du projet
                        const projectImageUrl = new URL(projectImage.image[type]);
                        // Extraire le nom du fichier de l'URL de l'image du projet
                        const projectImageFilename = path.basename(projectImageUrl.pathname);
                        // Vérifier si le nom du fichier de l'image du projet correspond au nom du fichier de l'image que nous supprimons
                        if (projectImageFilename === filename) {
                            // Si c'est le cas, définir l'indicateur sur true et sortir de la boucle
                            isImageUsedElsewhere = true;
                            break;
                        }
                    }
                    // Si l'image est utilisée ailleurs, sortir de la boucle
                    if (isImageUsedElsewhere) {
                        break;
                    }
                }
                // Si l'image n'est pas utilisée ailleurs, la supprimer de Vercel
                if (!isImageUsedElsewhere) {
                    await del(url.toString());
                    res.status(200).json({ message: "L'image a été supprimée avec succès !" });
                }
            }
        }
    }
    // Suppression du projet
    Projet.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.status(200).json({ message: "Le projet a été supprimé avec succès !" });
            } else {
                res.status(404).json({ message: `Impossible de supprimer le projet avec l'id ${id}. Le projet n'a pas été trouvé !` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message || `Une erreur s'est produite lors de la suppression du projet avec l'id ${id}` });
        });

};

