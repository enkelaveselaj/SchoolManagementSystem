# Notification System - Complete Guide

## Overview
The notification system enables real-time notifications to students and other users through the real-time-service microservice.

## Architecture
- **Real-time Service** (Port 5005): Stores and manages notifications in MongoDB
- **Academic Service** (Port 5003): Sends notifications via REST API
- **Frontend**: Displays notifications in student panel with real-time updates

## Notification Types

### 1. Grade Notifications
**Trigger**: When a teacher posts a grade for a student
**Fields**:
- title: "Grade Posted"
- message: "Your grade for [Subject] has been posted: [Score]/10"
- type: "grade"
- targetRole: "student"

**How to send**: Integrate with grade posting endpoint

### 2. Attendance Notifications
**Trigger**: When attendance is marked for a student
**Fields**:
- title: "Attendance Recorded"
- message: "Your attendance for [Date] has been marked as [Status]"
- type: "attendance"
- targetRole: "student"

**How to send**: Integrate with attendance marking endpoint

### 3. Assessment Notifications
**Trigger**: When a new assessment is created
**Fields**:
- title: "New Assessment"
- message: "A new assessment '[Name]' has been created. Due: [Date]"
- type: "assessment"
- targetRole: "student"

**How to send**: Integrate with assessment creation endpoint

### 4. Announcements
**Trigger**: Admin sends broadcast announcement
**Fields**:
- title: Custom announcement title
- message: Custom announcement message
- type: "announcement"
- targetRole: "student" | "teacher" | "parent"
- link: Optional URL to related content

**How to send**: POST to `/announcements` endpoint

---

## API Endpoints

### Create Announcement (Admin)
```
POST /announcements
Content-Type: application/json

{
  "title": "School Closure",
  "message": "School will be closed on Friday due to maintenance.",
  "targetRole": "student",
  "link": ""
}
```

### Get Notifications (Frontend)
```
GET /notifications?email=student@school.com
```

### Mark Notification as Read
```
PATCH /notifications/:id/read
```

---

## Integration Steps

### Step 1: Email Resolution
To send notifications, you need student email addresses. Options:
- **Option A**: Pass email in the request from frontend
- **Option B**: Query auth service for student email based on ID
- **Option C**: Store email in academic database

### Step 2: Add Notifications to Grade Posting
In `grade.js` controller:
```javascript
const notificationService = require('../services/notificationService');

// After grade is created/updated:
await notificationService.notifyStudentGradePosted(
  studentEmail,
  subjectName,
  gradeValue
);
```

### Step 3: Add Notifications to Attendance
In `attendance.js` service:
```javascript
const notificationService = require('../services/notificationService');

// After marking attendance:
await notificationService.notifyStudentAttendanceMarked(
  studentEmail,
  date,
  status
);
```

### Step 4: Add Notifications to Assessments
In `assessment.js` service:
```javascript
const notificationService = require('../services/notificationService');

// After creating assessment:
const students = await authServiceClient.getStudents();
for (const student of students) {
  await notificationService.notifyStudentAssessmentCreated(
    student.email,
    assessmentName,
    dueDate
  );
}
```

---

## Frontend Display
Students see notifications in the **"Notifications"** tab of the StudentPanel:
- Unread notifications show with a blue dot
- Click to view full message
- Messages show type, date, and timestamp

---

## Environment Variables
Add to academic-service `.env`:
```
REALTIME_API_URL=http://localhost:5005
```

---

## Testing
1. Start real-time service: `npm start` (port 5005)
2. Start academic service: `npm start` (port 5003)
3. Create/update grades, attendance, or assessments
4. Check StudentPanel notifications tab

---

## Current Status
✅ Infrastructure complete - API endpoints ready
⏳ Integration pending - Grade/Attendance/Assessment triggers need implementation

## Next Steps
1. Implement grade notification integration
2. Implement attendance notification integration
3. Implement assessment notification integration
4. Add email-to-student mapping logic
5. Test end-to-end notification flow
