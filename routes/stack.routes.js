const express = require('express');
const router = express.Router();
const stack = require("../controllers/stack.controller.js");

router.post("/", stack.createStack);
router.get("/", stack.getAllStacks);
router.get("/:id", stack.getStackById);
router.put("/:id", stack.updateStack);
router.delete("/:id", stack.deleteStack);

module.exports = router;