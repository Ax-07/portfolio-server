const express = require('express');
const router = express.Router();
const categorie = require("../controllers/categorie.controller.js");

router.post("/", categorie.createCategorie);
router.get("/", categorie.getAllCategories);
router.get("/:id", categorie.getCategorieById);
router.put("/:id", categorie.updateCategorie);
router.delete("/:id", categorie.deleteCategorie);

module.exports = router;