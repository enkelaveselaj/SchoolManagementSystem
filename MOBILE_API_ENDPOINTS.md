# Mobile App API Endpoints Documentation

**Created for**: School Management System Mobile App (Lab 3)
**Date**: June 8, 2026
**Status**: Ready for Integration

---

## 🔗 API Gateway Setup

**Base URL**:
- Development: `http://localhost:5000`
- Production: `https://your-server.com`

**CORS Support**: ✅ Mobile apps, Expo, Android emulators, iOS simulators

---

## 🔐 Authentication Endpoints

### 1. User Login

**Endpoint**: `POST /auth/login`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "student@school.com",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "student@school.com",
    "role": "Student",
    "is_super_admin": false
  }
}
```

**Response Error (400)**:
```json
{
  "error": "Invalid password" // or "User not found"
}
```

---

### 2. User Registration

**Endpoint**: `POST /auth/register`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@school.com",
  "password": "securePassword123"
}
```

**Response Success (201)**:
```json
{
  "id": 124,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@school.com",
  "role": "Student"
}
```

**Response Error (400)**:
```json
{
  "error": "User already exists" // or other validation error
}
```

---

### 3. Forgot Password

**Endpoint**: `POST /auth/forgot-password`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "student@school.com"
}
```

**Response (200)**:
```json
{
  "message": "If an account exists with this email, a reset link has been sent."
}
```

**Note**: 
- For security, always returns success message (doesn't reveal if email exists)
- In development mode, reset token is included in response for testing
- Email sent to user's inbox with reset link

---

### 4. Reset Password

**Endpoint**: `POST /auth/reset-password/:token`

**Headers**:
```
Content-Type: application/json
```

**URL Params**:
```
:token - Reset token from forgot password email or response
```

**Request Body**:
```json
{
  "newPassword": "newSecurePassword456"
}
```

**Response Success (200)**:
```json
{
  "message": "Password reset successfully. You can now login with your new password."
}
```

**Response Error (400)**:
```json
{
  "error": "Invalid or expired reset token"
}
```

---

### 5. Verify Email

**Endpoint**: `POST /auth/verify-email`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "token": "verification-token-from-email"
}
```

**Response Success (200)**:
```json
{
  "message": "Email verified successfully. You can now login."
}
```

**Response Error (400)**:
```json
{
  "error": "Invalid or expired verification token"
}
```

---

## 📚 Academic Endpoints

### 6. Get Student Grades

**Endpoint**: `GET /grades?studentId=123`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Query Params**:
```
studentId (required) - Student ID
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "studentId": 123,
    "subject": "Mathematics",
    "grade": 9,
    "date": "2024-05-15"
  },
  {
    "id": 2,
    "studentId": 123,
    "subject": "English",
    "grade": 8,
    "date": "2024-05-14"
  }
]
```

---

### 7. Get Student Attendance

**Endpoint**: `GET /attendance/student/:studentId`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**URL Params**:
```
:studentId - Student ID
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "studentId": 123,
    "date": "2024-05-15",
    "status": "Present",
    "subject": "Mathematics"
  },
  {
    "id": 2,
    "studentId": 123,
    "date": "2024-05-15",
    "status": "Absent",
    "subject": "English"
  }
]
```

---

### 8. Get Attendance Statistics

**Endpoint**: `GET /attendance/student/:studentId/stats`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**URL Params**:
```
:studentId - Student ID
```

**Response (200)**:
```json
{
  "studentId": 123,
  "totalClasses": 100,
  "classesAttended": 92,
  "classesAbsent": 6,
  "classesLate": 2,
  "attendancePercentage": 92.0
}
```

---

### 9. Get Assessments

**Endpoint**: `GET /assessments`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "title": "Math Quiz 1",
    "description": "Chapter 1-3 assessment",
    "dueDate": "2024-05-20",
    "createdAt": "2024-05-10"
  },
  {
    "id": 2,
    "title": "English Essay",
    "description": "Write a 2-page essay",
    "dueDate": "2024-05-25",
    "createdAt": "2024-05-12"
  }
]
```

---

### 10. Get Assessment Scores

**Endpoint**: `GET /assessment-scores/:studentId`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**URL Params**:
```
:studentId - Student ID
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "assessmentId": 1,
    "studentId": 123,
    "score": 85,
    "maxScore": 100,
    "submittedAt": "2024-05-18",
    "gradedAt": "2024-05-19"
  }
]
```

---

### 11. Get Announcements

**Endpoint**: `GET /announcements`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "title": "School Closure",
    "message": "School will be closed on Friday due to maintenance.",
    "targetRole": "student",
    "type": "announcement",
    "createdAt": "2024-05-15"
  },
  {
    "id": 2,
    "title": "Parent-Teacher Conference",
    "message": "Conference scheduled for next month",
    "targetRole": "student",
    "type": "announcement",
    "createdAt": "2024-05-14"
  }
]
```

---

### 12. Mark Notification as Read

**Endpoint**: `PATCH /announcements/:id/read`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**URL Params**:
```
:id - Announcement/Notification ID
```

**Response (200)**:
```json
{
  "message": "Notification marked as read"
}
```

---

## 📊 Dashboard Endpoints

### 13. Get Student Dashboard (NEW)

**Endpoint**: `GET /api/dashboard/student/:studentId`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**URL Params**:
```
:studentId - Student ID
```

**Response (200)**:
```json
{
  "studentId": 123,
  "name": "John Doe",
  "attendancePercentage": 92.5,
  "averageGrade": 8.2,
  "recentGrades": [
    {
      "subject": "Mathematics",
      "grade": 9,
      "date": "2024-05-15"
    },
    {
      "subject": "English",
      "grade": 8,
      "date": "2024-05-14"
    },
    {
      "subject": "Science",
      "grade": 8.5,
      "date": "2024-05-13"
    }
  ],
  "pendingAssessments": 3,
  "upcomingTimetable": [
    {
      "subject": "Mathematics",
      "time": "09:00 - 10:00",
      "room": 101
    },
    {
      "subject": "English",
      "time": "10:00 - 11:00",
      "room": 102
    }
  ],
  "latestAnnouncements": [
    {
      "title": "School Closure",
      "date": "2024-05-15"
    },
    {
      "title": "Parent-Teacher Conference",
      "date": "2024-05-14"
    }
  ]
}
```

---

## 🔔 Real-Time Notifications

### WebSocket Connection (Socket.io)

**URL**: `http://localhost:5005` (Real-time Service)

**Events to Listen**:
```javascript
socket.on("new_grade", (data) => {
  // data: { student_id, subject, grade, date }
})

socket.on("attendance_marked", (data) => {
  // data: { student_id, date, status }
})

socket.on("new_assessment", (data) => {
  // data: { assessment_id, title, due_date }
})

socket.on("new_announcement", (data) => {
  // data: { title, message, target_role }
})
```

---

## 🛡️ Authentication

All endpoints require JWT token in Authorization header (except login/register/forgot-password):

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Token format: JWT (JSON Web Token)
Token expiry: 1 hour
Refresh: Use login endpoint again
```

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success (GET, PATCH)
- `201` - Created (POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

---

## 📝 Testing with Postman

1. Import the Postman collection: `School_Mobile_API.postman_collection.json`
2. Set base URL: `http://localhost:5000`
3. Follow the order:
   - Register → Login → Get Dashboard
   - Test Forgot Password → Reset Password
   - Get Grades, Attendance, Assessments

---

## 🔄 Usage Flow for Mobile App

```
1. User Opens App
   ↓
2. Register OR Login (get JWT token)
   ↓
3. Store token in localStorage/AsyncStorage
   ↓
4. Add token to ALL subsequent requests
   ↓
5. Fetch Dashboard Data
   ↓
6. Subscribe to Real-time Socket.io events
   ↓
7. Display data in UI
```

---

## 💡 Mobile Implementation Tips

**Token Management**:
```javascript
// Mobile teams: Store token in AsyncStorage
await AsyncStorage.setItem('auth_token', response.data.token);

// Add to all requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

**Error Handling**:
```javascript
// Always handle 401 errors by logging user out
if (error.response.status === 401) {
  // Clear stored token
  // Redirect to login
}
```

**Real-time Updates**:
```javascript
// Connect Socket.io for notifications
import io from 'socket.io-client';
const socket = io('http://localhost:5005');

socket.on('new_announcement', (data) => {
  // Show in-app notification banner
});
```

---

## 📞 Support

**Issues?**
- Check endpoint format matches exactly
- Verify JWT token is included
- Check CORS settings
- Test with Postman first before mobile integration

**Contact**: Person 1 (Backend Lead)

---

**Document Version**: 1.0
**Last Updated**: June 8, 2026
**Status**: ✅ Ready for Mobile Team Integration

