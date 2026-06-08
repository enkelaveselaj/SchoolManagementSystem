# 📱 LAB 3: SCHOOL MANAGEMENT MOBILE APP
## Project Kick-Off Document

**Project Name**: School Management System - Mobile Edition
**Team Size**: 5 People
**Duration**: 3 Weeks
**Target**: Create iOS + Android app from React backend
**Status**: 🟢 **READY TO START**

---

## 🎯 PROJECT OVERVIEW

You have a complete **School Management System** with working backend (Auth, Database, APIs). Your task is to create a **mobile app** using React Native that:

1. ✅ Reuses your existing backend (no changes needed, just extensions)
2. ✅ Runs on both iOS and Android (single codebase)
3. ✅ Includes 5+ features (Grades, Attendance, Assessments, Announcements, Dashboard)
4. ✅ Includes real-time notifications
5. ✅ Meets all lab requirements

---

## 👥 WHO DOES WHAT (5-PERSON TEAM)

### 🔧 Person 1: Backend Extensions (Senior Dev)
**Week 1 Only** | 12 hours
- Add forgot password to backend
- Add password reset functionality
- Add email verification
- Create dashboard API endpoint

### 📐 Person 2: Mobile Project Setup (React Lead)
**Week 1, Days 1-3** | 8.5 hours
- Initialize React Native project with Expo
- Set up navigation system
- Configure API base setup
- Create placeholder screens

### 🔐 Person 3: Authentication (Auth Dev)
**Week 1-2** | 11 hours
- Create login screen (fully designed)
- Create signup screen (fully designed)
- Create password reset screen
- Implement token management
- Write tests

### 📊 Person 4: Dashboard + Academics (Features Dev 1)
**Week 2** | 8-10 hours
- Create dashboard with statistics
- Create grades viewer with filtering
- Create attendance tracker
- Write tests

### 🔔 Person 5: Assessments + Notifications (Features Dev 2)
**Week 2-3** | 13-15 hours
- Create assessments viewer
- Create real-time announcements feed
- Implement push notifications
- Set up Socket.io connection
- Write tests

---

## 📋 WHAT SUCCESS LOOKS LIKE

### Week 1 End:
- Project structure created
- Navigation working
- All screens stubbed out
- Backend extensions complete

### Week 2 End:
- Auth flow complete and tested
- Dashboard screen working
- Grades and attendance displaying
- All screens connected to real APIs

### Week 3 End:
- Assessments module complete
- Real-time notifications working
- Push notifications working
- 80%+ test coverage
- Ready for app store submission

### Week 4 (Bonus):
- Build for iOS/Android
- Submit to App Store (Beta)
- Collect feedback

---

## 🛠️ TECH STACK (WHAT YOU'LL USE)

```
Frontend:      React Native (with Expo)
Navigation:    React Navigation
State:         Zustand (lightweight)
HTTP:          Axios
Storage:       AsyncStorage
Notifications: react-native-push-notifications
Real-time:     Socket.io-client
Testing:       Jest + React Native Testing Library
Backend:       Your existing Node.js services
Database:      Your existing MySQL/MongoDB
```

---

## 📚 DOCUMENTS YOU'LL USE

| Document | Purpose | Read By |
|----------|---------|---------|
| `QUICK_START.md` | **START HERE** - One-page overview | Everyone (Day 1) |
| `MOBILE_APP_STRATEGY.md` | Full strategy + architecture | Everyone (Day 1-2) |
| `ROLE_PERSON_1_2.md` | Detailed tasks + code examples | Person 1 & 2 |
| `ROLE_PERSON_3_4_5.md` | Detailed tasks + code examples | Person 3, 4, & 5 |
| `REQUIREMENTS_MAPPING.md` | How you meet all lab requirements | Everyone (Day 2) |

---

## 🚀 DAY 1: KICKOFF CHECKLIST

### Everyone (30 mins)
- [ ] Clone the repository
- [ ] Read `QUICK_START.md`
- [ ] Install Node.js 16+ (if not already)
- [ ] Install VS Code (if not using it)
- [ ] Join team communication channel

### Person 1 (Backend Dev)
- [ ] Set up your IDE for Node.js
- [ ] Review existing auth service code
- [ ] Start forgot password implementation

### Person 2 (Project Lead)
- [ ] Install Expo CLI: `npm install -g expo-cli`
- [ ] Create new Expo project
- [ ] Set up GitHub repo/branch
- [ ] Install all dependencies

### Persons 3-5 (Mobile Devs)
- [ ] Set up development environment
- [ ] Create your feature branch in Git
- [ ] Make your first commit
- [ ] Wait for Person 2's project setup

### FIRST STANDUP (Day 1, end of day)
- What you'll work on tomorrow
- Any blockers?
- Questions?

---

## 📱 EXPECTED FEATURES IN FINAL APP

### 1. **Login Screen** 📲
- Clean, professional design
- Email/password fields
- Error messages
- Forgot password link
- Sign up link

### 2. **Dashboard** 📊
- Welcome message with student name
- Quick stats (Attendance %, Avg Grade, Pending Assessments)
- Recent grades
- Today's schedule
- Latest announcements

### 3. **Grades Viewer** 📈
- List of all grades by subject
- Color-coded grades (green=A, blue=B, etc.)
- Filter/sort options
- Historical data

### 4. **Attendance Tracker** 📅
- Overall attendance percentage (large, prominent)
- Monthly breakdown
- Status history (Present/Absent/Late)
- Visual progress bar

### 5. **Assessment Manager** 📝
- Pending assessments
- Submitted assessments
- Graded assessments with scores
- Due date countdowns
- Assessment details

### 6. **Announcements Feed** 📢
- Real-time pushes
- Pull-to-refresh
- Search functionality
- Filter by type

### 7. **Notifications** 🔔
- Push notifications for important events
- Banner notifications in-app
- Notification history
- Notification preferences

### 8. **Settings** ⚙️
- Profile view
- Notification on/off
- Theme (light/dark)
- About section
- Logout button

---

## 💡 KEY DECISIONS & WHY

### Why React Native (not Flutter or Native)?
✅ Your team already knows React.js - **Zero learning curve**
✅ Single codebase for iOS + Android - **50% faster development**
✅ Expo CLI makes testing super easy - **Scan QR code on phone**
✅ Perfect for 5-person team with 3-week deadline

### Why Expo (not bare React Native)?
✅ No native compilation needed - **Works immediately**
✅ Test on phone instantly - **Scan QR code**
✅ Simplified deployment - **Easier for non-veterans**
✅ Perfect for MVP - **Can go native later if needed**

### Why Zustand (not Redux)?
✅ 1/10th the boilerplate code - **Faster to implement**
✅ Easier to understand - **Less learning curve**
✅ Sufficient for this project size - **Redux is overkill**

### Why reuse backend?
✅ Auth is already built - **Don't rebuild**
✅ Database is already set up - **Don't migrate**
✅ All APIs are ready - **Just consume them**
✅ Saves 3-4 weeks of work - **Focus on mobile**

---

## 📊 TIME DISTRIBUTION

```
PERSON 1 (Backend):        ████░░░░░░ 12 hrs (Week 1 only)
PERSON 2 (Setup):          ████░░░░░░ 8.5 hrs (Week 1 focus)
PERSON 3 (Auth):           ███████░░░ 11 hrs (Week 1-2)
PERSON 4 (Dashboard):      ████████░░ 8-10 hrs (Week 2)
PERSON 5 (Notifications):  █████████░ 13-15 hrs (Week 2-3)
                           ──────────────────────
TOTAL TEAM TIME:           ██████████ ~60-70 hours

Average per person:        ~12-14 hours/person
Average per week:          ~20-25 hours/person
```

---

## ✅ MEETING ALL LAB REQUIREMENTS

### Functional Requirements ✅
- ✅ User authentication (login/signup/forgot password)
- ✅ 5 core modules (Exceeds 3 minimum)
- ✅ API integration (20+ endpoints)
- ✅ Responsive mobile UI
- ✅ Push notifications + real-time

### Technical Requirements ✅
- ✅ Platform: React Native (compiles to iOS + Android)
- ✅ Tools: VS Code + Expo
- ✅ Version Control: Git + GitHub
- ✅ Architecture: Clean MVC patterns
- ✅ Testing: 80%+ coverage with unit + UI tests

**Expected Grade: A/A+** (if implementation is clean)

---

## 🎯 CRITICAL SUCCESS FACTORS

1. **Person 2 finishes setup by Day 3**
   - Without this, others are blocked
   - Should be straightforward
   
2. **Person 1 finishes backend by Day 5**
   - Others need working API endpoints
   - Just extensions, not rebuilding
   
3. **Daily communication**
   - 15-min standup each day
   - Blockers resolved immediately
   
4. **Test as you go**
   - Don't test everything at end
   - Write tests while developing
   
5. **Use mock data early**
   - Test UI before API is ready
   - Swap real data in later

---

## ⚠️ COMMON PITFALLS TO AVOID

❌ **DON'T**: Try to build everything before testing
✅ **DO**: Test each screen as you build it

❌ **DON'T**: Wait for Person 1 to finish before starting screens
✅ **DO**: Use mock data, replace later

❌ **DON'T**: Skip testing - "We'll add tests later"
✅ **DO**: Write tests as you go

❌ **DON'T**: Ignore git commits - Squash everything at end
✅ **DO**: Commit daily with clear messages

❌ **DON'T**: Build everything in one month
✅ **DO**: Have working MVP by Week 2

---

## 📞 SUPPORT & ESCALATION

**Quick Questions?** → Ask relevant person (see "Who Does What")

**Blocker (can't proceed)?**
1. Try standalone/mock data
2. Ask team lead (Person 2)
3. Post in team chat with context
4. Time-box: max 30 mins on your own

**Person Blocked?**
- If waiting on API → Use mock data, continue
- If navigation issue → Ask Person 2
- If auth issue → Ask Person 3
- If data issue → Ask Person 4/5

---

## 🏆 BONUS FEATURES (If Time Permits)

- Dark mode toggle
- Offline data caching
- Biometric login (fingerprint/face)
- Student profile page
- Parent view (if applicable)
- Charts/graphs for grades
- In-app messaging
- Calendar integration
- Weather widget

---

## 📦 FINAL DELIVERABLES (Week 3)

### Code:
- ✅ React Native app with 8+ screens
- ✅ 80%+ test coverage
- ✅ Clean, documented code
- ✅ 50+ Git commits

### Documentation:
- ✅ README with setup instructions
- ✅ API documentation
- ✅ Code comments
- ✅ Test coverage report

### Builds:
- ✅ iOS build (via Expo/EAS)
- ✅ Android build (via Expo/EAS)
- ✅ TestFlight distribution (iOS)
- ✅ Google Play internal testing (Android)

---

## 🎓 LEARNING OUTCOMES

After this project, your team will know:
- ✅ React Native fundamentals
- ✅ Mobile app architecture
- ✅ Real-time notifications
- ✅ API integration in mobile
- ✅ Mobile testing best practices
- ✅ App store deployment
- ✅ Cross-platform development

---

## 🚀 YOU'RE READY!

### Next Steps:
1. **TODAY**: Everyone reads `QUICK_START.md`
2. **TODAY**: Persons 1 & 2 start their tasks
3. **TOMORROW**: Person 2 has project ready
4. **TOMORROW**: Persons 3-5 start after setup
5. **WEEK 2**: All working on features
6. **WEEK 3**: Integration and polishing

### Questions Before We Start?
- Ask in team chat
- Reference the detailed guides
- Clarify scope with team lead

---

## 🎉 LET'S SHIP THIS!

You have:
✅ A complete backend ready to reuse
✅ 3 weeks to build the mobile app
✅ 5 talented people
✅ Clear task breakdown
✅ Detailed documentation
✅ A straightforward plan

**What could go wrong?**
- Nothing, if you follow the plan!

**Any questions?**
- See documents above
- Ask in standup
- Check with person who owns that area

---

## 📊 PROJECT STATUS TRACKER

Use this to track progress:

**Week 1:**
- [ ] Day 1: Team setup, documentation read
- [ ] Day 2: Project initialized, backend started
- [ ] Day 3: Project structure complete, navigation working
- [ ] Day 4: Auth backend ready, auth screens started
- [ ] Day 5: Auth flow complete end-to-end

**Week 2:**
- [ ] Day 6: Dashboard screen working
- [ ] Day 7: Grades and attendance displaying
- [ ] Day 8: Assessments working
- [ ] Day 9: Announcements integration
- [ ] Day 10: Real-time notifications working

**Week 3:**
- [ ] Day 11: All features polished
- [ ] Day 12: Tests at 80%+ coverage
- [ ] Day 13: Bug fixes and optimization
- [ ] Day 14: Build ready for stores
- [ ] Day 15: Ready for submission!

---

## 📧 SUMMARY EMAIL TO TEAM

**Subject: 🚀 Lab 3 Project Kickoff - Mobile App Development**

---

Hi Team!

We're building a **React Native mobile app** that reuses our Lab 2 backend. Here's the 1-minute version:

**What**: School Management System for iOS + Android
**When**: 3 weeks  
**Team**: 5 people (5 independent roles)
**Platform**: React Native with Expo (single codebase for both)
**Status**: Ready to start Monday morning

**Your Role**:
- Person 1: Backend extensions
- Person 2: Mobile project setup & navigation
- Person 3: Authentication screens
- Person 4: Dashboard + grades + attendance
- Person 5: Assessments + announcements + notifications

**How to Get Started**:
1. Read `QUICK_START.md` (5 mins)
2. Create your Git branch
3. Day 1 standup at [TIME]

**Documentation**:
- `QUICK_START.md` - One-page overview
- `MOBILE_APP_STRATEGY.md` - Full plan
- Your specific role guide (ROLE_PERSON_X_Y.md)
- Check wiki for daily updates

**Next Standup**: Day 1, 4 PM (tell status + blockers)

**Let's ship this!** 🚀

---

The plan is solid. The tech stack is right. Your team is capable. Let's make it happen!


