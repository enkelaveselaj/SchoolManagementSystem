# Mobile App Development Strategy - Lab 3
## School Management System - Cross-Platform Mobile Application

---

## 📋 EXECUTIVE SUMMARY

### ✅ What You Already Have (Lab 2):
Your backend is **PRODUCTION-READY** and can be reused as-is:

| Component | Status | Details |
|-----------|--------|---------|
| **Authentication** | ✅ Complete | JWT-based login/signup, Role-based access (Admin, Teacher, Student, Parent) |
| **Academic Features** | ✅ Complete | Attendance, Grades, Assessments, Subjects, Timetables, Assessment Scores |
| **Notifications** | ✅ Complete | Real-time notifications via MongoDB & Socket.io |
| **API Gateway** | ✅ Complete | Express-based proxy for all services |
| **Database** | ✅ Complete | MySQL (auth/academic) + MongoDB (notifications) |

### ❌ What Needs to Change:
**ONLY the Frontend** - Replace React web app with a mobile app

### 🎯 Recommended Approach for Your Team:
**React Native (Expo)** - Single codebase for iOS + Android, JavaScript/React (team familiar)

**Why React Native over others:**
- Your team already knows React.js ✅
- Easiest learning curve (share code between iOS/Android) ✅
- Expo accelerates development (no native setup needed) ✅
- Can be distributed via iOS App Store & Google Play Store ✅
- Best for 5-person team with tight deadline ✅

**Alternative:** Flutter - Similar benefits, smaller learning curve for beginners

---

## 📊 PROJECT REQUIREMENTS vs. YOUR BACKEND

### Mandatory Requirement 1: User Authentication ✅
**Status:** Already Implemented
```
Endpoints:
- POST /auth/login
- POST /auth/register
What you'll do: Create mobile UI for login/signup with email/password
Additional: Add forgot password endpoint to auth-service (simple task)
```

### Mandatory Requirement 2: Core Feature Set (Min 3 Modules) ✅
**Your Backend Already Provides:**
1. **Attendance Tracking** - GET/POST attendance records
2. **Grade Viewer** - GET grades per subject/student
3. **Assessment Management** - GET/POST assessments, view scores
4. **Timetable Display** - GET class schedules
5. **Announcement Feed** - GET announcements

**You'll implement 3 core modules in mobile:**
- 📅 **Student Dashboard** (Grades + Attendance Stats)
- 📝 **Assessment Tracker** (View assignments, deadlines, scores)
- 📢 **Announcement Feed** (Real-time notifications)

### Mandatory Requirement 3: API Integration ✅
**Already Have:** Your own microservices REST APIs
**Optional External API:** Weather API, Google Maps (for location-based) - nice to have

### Mandatory Requirement 4: Responsive UI/UX ✅
**React Native** automatically handles all screen sizes (phones, tablets)

### Mandatory Requirement 5: Notifications ✅
**Status:** Already implemented via Real-time Service
**Mobile Implementation:** 
- Use React Native Push Notifications
- Connect to your existing notification endpoints

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│              React Native Mobile App (Expo)                │
│  (iOS + Android - Single Codebase)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Screens:          Services:           Storage:             │
│  • Login           • Auth Service       • AsyncStorage       │
│  • Dashboard       • API Client         • Local Notifications│
│  • Grades          • Grade Service      • App State          │
│  • Attendance      • Attendance Srv     │                    │
│  • Assessments     • Assessment Srv     │                    │
│  • Announcements   • Notifications Srv  │                    │
│  • Settings        • Real-time Srv      │                    │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
   │ API       │    │ Real-time │    │ External │
   │ Gateway   │    │ Service   │    │ APIs     │
   │(Port 5000)│    │(Socket.io)│    │(Optional)│
   └──────────┘    └──────────┘    └──────────┘
        │                │
   ┌────▼──────────────────▼─────────┐
   │   Your Existing Backend (Lab 2)  │
   │  Auth, Academic, School Service  │
   └────────────────────────────────┘
```

---

## 🎯 PLATFORM CHOICE COMPARISON

| Feature | React Native (Expo) | Flutter | Native (Java/Swift) |
|---------|-------------------|----------|-------------------|
| **Learning Curve** | ⭐ Easiest (React.js) | 🟡 Medium | 🔴 Hard |
| **Development Speed** | ⭐⭐⭐ Fast | ⭐⭐⭐ Fast | 🟡 Slow |
| **Code Reuse** | ✅ 95% shared | ✅ 99% shared | ❌ 0% |
| **Team Familiarity** | ✅ React devs ✅✅✅ | 🟡 Need training | ❌ Need training |
| **Deployment** | ✅ Expo Cloud Build | ✅ Easy | 🟡 Complex |
| **Performance** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐⭐ Best |
| **App Store** | ✅ Both | ✅ Both | ✅ Both |

### ✅ RECOMMENDED: **React Native + Expo**
- Your entire team already knows React
- Quickest time-to-market
- Easy to test on both iOS & Android simulators
- Perfect for 5-person team with deadline

---

## 👥 5-PART WORK BREAKDOWN (for 5 people)

### **TEAM STRUCTURE & TASKS**

#### **PERSON 1: Backend Extensions & API Integration (Senior Dev)**
**Responsibility:** Add missing backend features needed for mobile
**Tasks:**
1. Add "Forgot Password" endpoint to Auth Service
   - Generate password reset token
   - Send reset email
   - Validate & update password
2. Create password reset routes (POST /auth/forgot-password, POST /auth/reset-password)
3. Add email verification endpoint (for new registrations)
4. Create analytics/dashboard endpoint:
   - GET /dashboard/student/:studentId (consolidated data)
   - Returns: attendance %, grades summary, upcoming assessments
5. Deploy/document all APIs for mobile integration
6. **Setting Up Environment:**
   - Ensure all backend services are running
   - Document API endpoints (.postman collection)
   - Set up CORS for mobile app domain

**Timeline:** Week 1 (can be done in parallel)
**Deliverable:** Updated backend + API documentation

---

#### **PERSON 2: Project Setup & Core Navigation (React Native Lead)**
**Responsibility:** Initialize React Native project, architecture, navigation
**Tasks:**
1. **Initialize Expo Project**
   ```bash
   npx create-expo-app SchoolMobileApp
   ```

2. **Install Core Dependencies:**
   - `@react-navigation/native` - Navigation
   - `@react-navigation/stack` - Stack navigation
   - `@react-navigation/bottom-tabs` - Tab navigation
   - `axios` - API calls
   - `@react-native-async-storage/async-storage` - Local storage
   - `react-native-push-notifications` - Push notifications
   - `zustand` or `redux` - State management

3. **Set up Project Structure:**
   ```
   SchoolMobileApp/
   ├── src/
   │   ├── screens/
   │   │   ├── LoginScreen.jsx
   │   │   ├── DashboardScreen.jsx
   │   │   ├── GradesScreen.jsx
   │   │   ├── AttendanceScreen.jsx
   │   │   ├── AssessmentsScreen.jsx
   │   │   ├── AnnouncementsScreen.jsx
   │   │   └── SettingsScreen.jsx
   │   ├── components/
   │   │   ├── GradeCard.jsx
   │   │   ├── AttendanceChart.jsx
   │   │   └── NotificationBanner.jsx
   │   ├── services/
   │   │   ├── api.js (Axios instance)
   │   │   ├── authService.js
   │   │   └── studentService.js
   │   ├── hooks/
   │   │   ├── useAuth.js
   │   │   └── useStudent.js
   │   ├── navigation/
   │   │   ├── AuthNavigator.jsx
   │   │   ├── AppNavigator.jsx
   │   │   └── RootNavigator.jsx
   │   ├── store/
   │   │   └── authStore.js
   │   ├── styles/
   │   │   └── colors.js
   │   └── utils/
   │       └── constants.js
   ├── App.js
   ├── app.json
   └── package.json
   ```

4. **Create Navigation Stack:**
   - Auth Stack (Login, Register, Forgot Password)
   - App Stack (Dashboard, Grades, Attendance, Assessments, Announcements)
   - Tab Navigation connecting all screens

5. **Set up API Base Configuration**
   - Create axios instance with base URL
   - Set up request/response interceptors
   - Handle token authentication

**Timeline:** Week 1 (Days 1-2)
**Deliverable:** Running Expo app with navigation structure, able to navigate between screens

---

#### **PERSON 3: Authentication & User Management (Auth Specialist)**
**Responsibility:** Login, signup, token management, user session
**Tasks:**
1. **Create AuthService (services/authService.js):**
   - `login(email, password)` - calls backend, stores JWT token
   - `signup(email, username, password, role)` - register new student
   - `logout()` - clear token & user data
   - `forgotPassword(email)` - request password reset
   - `resetPassword(token, newPassword)` - complete reset
   - `verifyEmail(token)` - verify email after signup

2. **Create Auth Store (Zustand/Redux):**
   - User state (email, name, role, studentId)
   - Token state
   - Loading states
   - Auth actions (setUser, setToken, logout)

3. **Create LoginScreen (screens/LoginScreen.jsx):**
   - Email/Password input fields
   - Login button
   - "Forgot Password" link
   - "Sign Up" link
   - Loading indicator
   - Error handling

4. **Create RegisterScreen (screens/RegisterScreen.jsx):**
   - Email, Username, Password inputs
   - Confirm Password field
   - Register button
   - Link to login
   - Form validation

5. **Create ForgotPasswordScreen:**
   - Email input
   - Send reset link button
   - Success confirmation message

6. **Token Management:**
   - Store JWT in AsyncStorage on login
   - Add token to all API requests (Authorization header)
   - Handle token expiration
   - Refresh token on expiration

7. **Testing Coverage:**
   - Unit tests for login validation
   - Test token storage/retrieval
   - Test logout functionality

**Timeline:** Week 1-2 (Days 2-5)
**Deliverable:** Full auth flow - login, signup, password reset all working

---

#### **PERSON 4: Student Dashboard & Academic Features (Features Developer 1)**
**Responsibility:** Main dashboard, grades, attendance display
**Tasks:**
1. **DashboardScreen (screens/DashboardScreen.jsx):**
   - Header with student name & welcome message
   - Quick stats: 
     - Attendance percentage
     - Grades overview (average)
     - Pending assessments count
   - Recent grades card (last 3 subjects)
   - Today's timetable (if available)
   - Quick action buttons (View All Grades, View Assessments, etc.)

2. **GradesScreen (screens/GradesScreen.jsx):**
   - List of subjects with grades
   - Filter by term/semester (if data available)
   - Tap to see grade details
   - Chart visualization (optional - use react-native-chart-kit)
   - Export/Share grade report button

3. **AttendanceScreen (screens/AttendanceScreen.jsx):**
   - Overall attendance percentage (large, prominent)
   - Monthly attendance breakdown
   - Date range selector
   - Attendance history list (date, status, subject)
   - Visual progress bar/gauge

4. **GradeCard Component (components/GradeCard.jsx):**
   - Display subject, score, grade
   - Color-coded based on grade (green=A, yellow=C, red=F)
   - Last updated date

5. **Create StudentService (services/studentService.js):**
   - `getStudentDashboard(studentId)` - fetch dashboard data
   - `getGrades(studentId)` - fetch all grades
   - `getAttendance(studentId)` - fetch attendance records
   - `getAttendanceStats(studentId)` - fetch stats

6. **Testing:**
   - Unit tests for grade calculation
   - UI tests for dashboard rendering
   - API mock tests

**Timeline:** Week 2 (Days 6-10)
**Deliverable:** Fully functional dashboard, grades, and attendance screens

---

#### **PERSON 5: Assessments, Announcements & Notifications (Features Developer 2)**
**Responsibility:** Assessment management, announcements, real-time notifications
**Tasks:**
1. **AssessmentsScreen (screens/AssessmentsScreen.jsx):**
   - List of active assessments
   - Filter tabs: Pending, Submitted, Graded
   - Card for each assessment showing:
     - Title
     - Due date (with countdown timer)
     - Status (Pending/Submitted/Graded)
     - Score (if graded)
   - Tap to see full details
   - Submit/View button

2. **AssessmentDetailScreen (screens/AssessmentDetailScreen.jsx):**
   - Full assessment details
   - Description
   - Due date
   - Current score (if graded)
   - Submission date (if submitted)
   - Teacher feedback

3. **AnnouncementsScreen (screens/AnnouncementsScreen.jsx):**
   - List of announcements (newest first)
   - Pull-to-refresh
   - Infinite scroll/pagination
   - Search announcements
   - Filter by type (all, academic, events, etc.)
   - Announcement card showing: title, date, preview

4. **NotificationService (services/notificationService.js):**
   - Connect to real-time service (Socket.io)
   - Listen for incoming notifications
   - Store notifications locally
   - `subscribeToNotifications(studentEmail)` - set up listener
   - `getNotifications()` - retrieve stored notifications
   - `markAsRead(notificationId)` - update read status

5. **Push Notifications Setup:**
   - Install `react-native-push-notifications`
   - Configure for both iOS and Android
   - Request user permission for notifications
   - Display local notifications on receipt
   - Handle notification taps (navigate to relevant screen)

6. **Real-time Sync:**
   - Connect Socket.io client to your real-time service
   - Listen for announcement broadcasts
   - Receive grade notifications
   - Receive attendance notifications
   - Display banner/badge for unread notifications

7. **Settings Screen (screens/SettingsScreen.jsx):**
   - User profile view
   - Notification preferences
   - Notification toggle
   - App theme (light/dark)
   - About section
   - Logout button

8. **Testing:**
   - Integration tests with real-time service
   - Notification permission tests
   - Socket.io connection tests

**Timeline:** Week 2-3 (Days 10-15)
**Deliverable:** Complete assessments, announcements, and notification system

---

## 📅 DEVELOPMENT TIMELINE

```
WEEK 1:
├─ Day 1-2:  Person 1 & 2 working in parallel (Backend + Project Setup)
├─ Day 3-5:  Person 3 (Auth), Person 2 (Navigation finalization)
│
WEEK 2:
├─ Day 6-10: Person 4 (Dashboard), Person 3 (Refinement)
├─ Day 8-10: Person 5 (Assessments & Notifications)
│
WEEK 3:
├─ Day 11-13: Person 4 & 5 (Feature refinement)
├─ Day 14-15: Integration testing, bug fixes
├─ Day 15:    Performance optimization, polish UI
│
Deployment:
├─ Day 16-17: Build for iOS/Android
├─ Day 18:    Submit to App Store/Play Store
```

---

## 🛠️ TECH STACK (FINAL)

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React Native + Expo | Latest |
| State Management | Zustand (lightweight) | ^4.x |
| HTTP Client | Axios | ^1.x |
| Navigation | React Navigation | ^6.x |
| Notifications | react-native-push-notifications | Latest |
| Real-time | Socket.io-client | ^4.x |
| Storage | AsyncStorage | ^1.x |
| Charts (Optional) | react-native-chart-kit | ^6.x |
| Testing | Jest + React Native Testing Library | Latest |

---

## 🔌 BACKEND API ENDPOINTS YOU'LL USE

```
AUTH SERVICE (Port 5001):
POST   /auth/login
POST   /auth/register
POST   /auth/forgot-password          [NEEDS IMPLEMENTATION]
POST   /auth/reset-password           [NEEDS IMPLEMENTATION]
POST   /auth/verify-email             [NEEDS IMPLEMENTATION]

ACADEMIC SERVICE (Port 5003):
GET    /grades?studentId=X
GET    /grades/:id
GET    /attendance/student/:studentId
GET    /attendance/student/:studentId/stats
GET    /assessments
GET    /assessment-scores/:studentId
GET    /announcements
PATCH  /announcements/:id/read

REAL-TIME SERVICE (Port 5005):
GET    /notifications?email=X
PATCH  /notifications/:id/read
WebSocket: Socket.io connection for real-time updates

Dashboard Endpoint [TO CREATE]:
GET    /api/dashboard/student/:studentId
Response: { attendance_percentage, grades_summary, pending_assessments, recent_grades }
```

---

## ✅ REQUIREMENTS CHECKLIST

### Mandatory Requirements Met ✅

| Requirement | Implementation | Status |
|-------------|-----------------|--------|
| **1. User Authentication** | |
| Login/Signup | Mobile screens + backend JWT | ✅ |
| Email/Password auth | AuthService + Login/Register screens | ✅ |
| Forgot Password | AuthService endpoint + screen | ✅ |
| **2. Core Feature Set (3+ Modules)** | |
| Module 1: Grade Viewer | GradesScreen + API | ✅ |
| Module 2: Attendance Tracker | AttendanceScreen + Stats | ✅ |
| Module 3: Assessment Tracker | AssessmentsScreen + Detail view | ✅ |
| Bonus: Announcements | AnnouncementsScreen | ✅ |
| Bonus: Timetable | Dashboard quick view | ✅ |
| **3. API Integration** | |
| REST API | Using your existing backend | ✅ |
| External API (Optional) | Weather/Maps (nice-to-have) | 🟡 |
| **4. Responsive UI/UX** | |
| Mobile-friendly design | React Native handles all sizes | ✅ |
| Intuitive navigation | Tab-based + Stack navigation | ✅ |
| Consistent layout | Design system with colors/spacing | ✅ |
| **5. Notifications** | |
| Push notifications | React Native Push Notifications | ✅ |
| Real-time notifications | Socket.io integration | ✅ |
| Local notifications | On-device alerts | ✅ |

### Technical Requirements Met ✅

| Requirement | Implementation | Status |
|-------------|-----------------|--------|
| **Platform** | React Native (Android + iOS) | ✅ |
| **Tools** | Expo (VS Code / Android Studio) | ✅ |
| **Version Control** | GitHub (your existing repo) | ✅ |
| **Architecture** | MVC pattern (Screens-Services-API) | ✅ |
| **Testing** | Jest + React Native Testing Library | ✅ |
| Unit Tests | AuthService, Validators | ✅ |
| UI Tests | Components, Navigation | ✅ |

---

## 🚀 GETTING STARTED (Week 1, Day 1)

### Prerequisites:
```bash
# Install Node.js 16+ (if not already)
# Install Expo CLI globally
npm install -g expo-cli

# Install development tools
npm install -g @react-native-community/cli-tools
```

### Day 1 Tasks:

**Person 1 (Backend):**
```bash
# Navigate to auth-service
cd backend/services/auth-service

# Review existing endpoints
# Create: forgot-password, reset-password, verify-email
# Test with Postman before mobile development
```

**Person 2 (Project Setup):**
```bash
# Create React Native project
npx create-expo-app SchoolMobileApp

# Add to your repo
cd SchoolMobileApp
git init
git add .
git commit -m "Initial React Native setup"
git push origin mobile-app-branch
```

**Persons 3, 4, 5:**
- Review the project structure
- Understand API endpoints
- Set up development environment
- Pull the repo and run project locally

---

## 📚 TESTING STRATEGY

### Unit Tests (10-15% of code):
```javascript
// authService.test.js
test('login with valid credentials returns token')
test('signup validates email format')
test('logout clears local storage')

// studentService.test.js
test('getGrades filters by subject')
test('getAttendance returns correct format')
```

### Integration Tests (5-10% of code):
```javascript
// AuthFlow.test.js
test('Complete login → dashboard flow')

// NotificationFlow.test.js
test('Receive real-time notification')
```

### UI Tests (5-10% of code):
```javascript
// LoginScreen.test.js
test('Login button calls authService')
test('Error message displays on failed login')

// GradesScreen.test.js
test('Grades display in correct order')
test('Filter by subject works')
```

---

## 🎯 NICE-TO-HAVE FEATURES (If Time Permits)

1. **Weather API Integration** - Show weather on dashboard
2. **Google Maps Integration** - School location map in app
3. **Offline Mode** - Cache data locally, sync when online
4. **Dark Mode** - Light/dark theme toggle
5. **Push Notifications from Teacher** - Teachers send direct messages
6. **Parent Module** - View child's grades/attendance (if parent user includes this)
7. **Biometric Login** - Fingerprint/Face ID login on supporting devices
8. **Analytics Dashboard** - Performance trends with charts

---

## ⚠️ IMPORTANT NOTES

1. **Keep Backend Unchanged**: The backend is already set up. Only add missing endpoints (forgot password, etc.)
2. **Use Existing Database**: All user data and academic records are in your MySQL/MongoDB
3. **Reuse API**: Don't build new APIs - just consume existing ones
4. **Token Management**: Store JWT in AsyncStorage, refresh when expired
5. **CORS Configuration**: Make sure backend allows requests from mobile app domain
6. **Environment Variables**: Store API base URL in .env file, different for dev/prod

---

## 📦 DELIVERABLES

### Week 1:
- ✅ Updated backend with forgot password
- ✅ React Native project initialized
- ✅ Navigation structure complete
- ✅ Auth flow working (login/signup)

### Week 2:
- ✅ Dashboard screen with quick stats
- ✅ Grades viewer
- ✅ Attendance tracker
- ✅ Assessments list

### Week 3:
- ✅ Announcements feed
- ✅ Real-time notifications
- ✅ Settings screen
- ✅ Complete testing suite
- ✅ Build for iOS/Android
- ✅ App Store submission (Beta)

---

## 🤝 COLLABORATION TIPS

1. **Use GitHub Branches**: Each person creates their own feature branch
   ```bash
   git checkout -b feature/auth-screens
   git checkout -b feature/dashboard
   git checkout -b feature/grades
   git checkout -b feature/assessments
   git checkout -b feature/notifications
   ```

2. **Daily Standups** (15 min): Each person reports progress/blockers

3. **Shared API Documentation**: Create postman collection
   ```
   export from backend, share with team
   everyone can test endpoints before integration
   ```

4. **Code Review**: Before merging, at least 1 person reviews PR

5. **Shared CommonUtils**: Core API calls in shared services folder
   ```
   src/services/api.js (shared)
   src/services/authService.js (shared)
   src/services/studentService.js (shared)
   ```

---

## 💡 WHY THIS APPROACH WORKS FOR YOUR SITUATION

✅ **Reuse Everything**: No need to rebuild backend, database, or authentication
✅ **Familiar Stack**: Entire team already knows JavaScript/React
✅ **Speed**: React Native development is 3x faster than native
✅ **One Codebase**: iOS and Android from single React Native app
✅ **5-Person Division**: Work naturally splits into independent modules
✅ **Meets All Requirements**: Covers authentication, 5+ features, notifications, testing
✅ **Professional Result**: App Store ready in 3 weeks

---

## ❓ FAQ

**Q: Can we use Flutter instead?**
A: Yes, but team would need 1-2 weeks to learn Dart. React Native reuses React knowledge.

**Q: Do we need to host the app?**
A: No. Endpoints connect to your backend (localhost or deployed server). App distributes via App Store/Play Store.

**Q: What if someone gets stuck?**
A: Each person's module is independent. Others can continue. Blockers are usually API-related - Person 1 helps.

**Q: Do we need Stripe payment?**
A: Not for MVP. Can add later if needed. Your real-time service has Stripe dependency but not required yet.

**Q: Can we preview on our phones?**
A: Yes! Expo Go app (free) lets you scan QR code and preview on real device instantly.

---

## 📞 QUICK START CHECKLIST

- [ ] Person 1: Review auth backend, plan password reset implementation
- [ ] Persons 2-5: Install Expo CLI and Node.js
- [ ] Everyone: Clone repo, review project structure
- [ ] Person 2: Initialize React Native project
- [ ] Everyone: Join daily standup calls
- [ ] Everyone: Set up GitHub feature branches

**Start Date**: Today
**Deadline**: 3 weeks
**Success Metric**: App passes all requirements, published to App Store/Play Store, minimum 80% test coverage


