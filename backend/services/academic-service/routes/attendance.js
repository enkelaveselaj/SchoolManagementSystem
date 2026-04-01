
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');

router.post('/', attendanceController.create);
router.get('/', attendanceController.getAll);
router.get('/:id', attendanceController.getById);
router.put('/:id', attendanceController.update);
router.delete('/:id', attendanceController.delete);

module.exports = router;