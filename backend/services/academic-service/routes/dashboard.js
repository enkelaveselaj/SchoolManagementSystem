const express = require("express");
const router = express.Router();
const { Grade, AssessmentScore, Attendance, Subject, Timetable, Assessment } = require("../src/models");
const { Op } = require("sequelize");

router.get("/student/:studentId", async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);

    if (isNaN(studentId)) {
      return res.status(400).json({ error: "Valid studentId is required" });
    }

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

    // 3. Average Grade (from finalized Grades table)
    const finalizedGrades = await Grade.findAll({ where: { studentId } });
    let averageGrade = 0;
    if (finalizedGrades.length > 0) {
        averageGrade = finalizedGrades.reduce((sum, g) => sum + g.value, 0) / finalizedGrades.length;
    } else {
        // Fallback to assessment scores average if no finalized grades
        const allScores = await AssessmentScore.findAll({ where: { studentId } });
        if (allScores.length > 0) {
            averageGrade = allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length;
        }
    }

    // 4. Pending Assessments (Count assessments that have no score for this student)
    const scoredAssessmentIds = recentScores.map(s => s.assessmentId);
    const pendingAssessments = await Assessment.count({
        where: {
            id: { [Op.notIn]: scoredAssessmentIds.length ? scoredAssessmentIds : [0] }
        }
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

    const dashboardData = {
      studentId,
      attendancePercentage,
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      recentGrades,
      pendingAssessments,
      upcomingTimetable,
      latestAnnouncements: []
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
