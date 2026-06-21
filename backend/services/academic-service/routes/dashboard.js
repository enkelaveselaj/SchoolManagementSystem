const express = require("express");
const router = express.Router();
const { Grade, AssessmentScore, Attendance, Subject, Timetable, Assessment } = require("../src/models");
const { Op } = require("sequelize");
const authServiceClient = require("../services/authServiceClient");

router.get("/student/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Resolve Auth UserID to domain StudentID
    const studentId = await authServiceClient.getStudentIdByUserId(userId);

    // 1. Calculate Attendance Percentage
    const totalAttendance = await Attendance.count({ where: { studentId } });
    const presentAttendance = await Attendance.count({
      where: {
        studentId,
        status: { [Op.in]: ['present', 'late'] }
      }
    });
    const attendancePercentage = totalAttendance > 0
      ? Math.round((presentAttendance / totalAttendance) * 100)
      : 100;

    // 2. Fetch Recent Assessment Scores
    const recentScores = await AssessmentScore.findAll({
      where: { studentId },
      limit: 5,
      order: [['graded_at', 'DESC']],
      include: [{ model: Assessment, as: 'assessment', include: [{ model: Subject, as: 'subject' }] }]
    });

    const recentGrades = recentScores.map(s => ({
      subject: s.assessment?.subject?.name || 'Assessment',
      grade: s.score,
      date: s.gradedAt || s.createdAt
    }));

    // 3. Average Grade
    const allScores = await AssessmentScore.findAll({ where: { studentId } });
    const averageGrade = allScores.length > 0
      ? allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length
      : 0;

    // 4. Pending Assessments
    const scoredIds = recentScores.map(s => s.assessmentId);
    const pendingAssessments = await Assessment.count({
        where: { id: { [Op.notIn]: scoredIds.length ? scoredIds : [0] } }
    });

    // 5. Today's Timetable
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    const upcomingTimetable = await Timetable.findAll({
        where: { day: today },
        limit: 3,
        include: [{ model: Subject, as: 'subject' }]
    }).then(items => items.map(t => ({
        subject: t.subject?.name || 'Subject',
        time: `${t.startTime} - ${t.endTime}`,
        room: t.room || 'TBD'
    })));

    res.json({
      attendancePercentage,
      averageGrade: parseFloat(averageGrade.toFixed(1)),
      recentGrades,
      pendingAssessments,
      upcomingTimetable,
      latestAnnouncements: []
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
