// src/routes/subject.js
const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject');

router.post('/', subjectController.create);
router.get('/', subjectController.getAll);
router.get('/:id', subjectController.getById);
router.put('/:id', subjectController.update);
router.delete('/:id', subjectController.delete);

module.exports = router;