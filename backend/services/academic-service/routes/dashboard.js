const express = require("express");
const router = express.Router();

router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const dashboardData = {
      studentId: parseInt(studentId),
      name: "Student Name",
      attendancePercentage: 92.5,
      averageGrade: 8.2,
      recentGrades: [
        {
          subject: "Mathematics",
          grade: 9,
          date: new Date().toISOString().split("T")[0],
        },
        {
          subject: "English",
          grade: 8,
          date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        },
        {
          subject: "Science",
          grade: 8.5,
          date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
        },
      ],
      pendingAssessments: 3,
      upcomingTimetable: [
        {
          subject: "Mathematics",
          time: "09:00 - 10:00",
          room: 101,
        },
        {
          subject: "English",
          time: "10:00 - 11:00",
          room: 102,
        },
      ],
      latestAnnouncements: [
        {
          title: "School Closure",
          date: new Date().toISOString().split("T")[0],
        },
        {
          title: "Parent-Teacher Conference",
          date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        },
      ],
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;


