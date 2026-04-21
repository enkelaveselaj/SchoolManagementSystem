const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');

// Mark attendance for multiple students
router.post('/mark', attendanceController.markAttendance);

// Get attendance for a specific class and date
router.get('/class/:classId', attendanceController.getClassAttendance);

// Get attendance statistics for a class
router.get('/class/:classId/stats', attendanceController.getClassAttendanceStats);

// Get attendance for a specific student
router.get('/student/:studentId', attendanceController.getStudentAttendance);

// Get attendance statistics for a student
router.get('/student/:studentId/stats', attendanceController.getStudentAttendanceStats);

// Get attendance report with filters
router.get('/report', attendanceController.getAttendanceReport);

// Get attendance summary for dashboard
router.get('/summary', attendanceController.getAttendanceSummary);

// Existing CRUD routes
router.post('/', attendanceController.create);
router.get('/', attendanceController.getAll);
router.get('/:id', attendanceController.getById);
router.put('/:id', attendanceController.update);
router.delete('/:id', attendanceController.delete);

module.exports = router;