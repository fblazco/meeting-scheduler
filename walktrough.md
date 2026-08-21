# Walkthrough: Project Skeleton Creation

We have scaffolded the complete project structure with empty files (`vacíos`) for the **University Tutoring Meeting Scheduler**.

## Created Structure Overview

### 1. Root Directory
- [`.gitignore`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/.gitignore): Git ignore rules for node_modules and environment variables.
- [`README.md`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/README.md): Project documentation overview.

---

### 2. Backend Skeleton (`TypeScript + Sequelize + PostgreSQL`)
Located in [`backend/`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend):

- **Configuration**:
  - [`src/config/database.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/config/database.ts): Database & Sequelize connection setup.
- **Models** (PostgreSQL / Sequelize):
  - [`src/models/index.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/models/index.ts): Model relations registry.
  - [`src/models/User.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/models/User.ts): User entity.
  - [`src/models/Schedule.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/models/Schedule.ts): Schedule calendar created by owners.
  - [`src/models/TimeSlot.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/models/TimeSlot.ts): Available time intervals.
  - [`src/models/Booking.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/models/Booking.ts): Meeting bookings & approvals.
- **Controllers & Services**:
  - [`src/controllers/authController.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/controllers/authController.ts) & [`src/services/authService.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/services/authService.ts)
  - [`src/controllers/scheduleController.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/controllers/scheduleController.ts) & [`src/services/scheduleService.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/services/scheduleService.ts)
  - [`src/controllers/bookingController.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/controllers/bookingController.ts) & [`src/services/bookingService.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/services/bookingService.ts)
  - [`src/controllers/userController.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/controllers/userController.ts)
- **Routes & Middlewares**:
  - [`src/routes/index.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/routes/index.ts), [`authRoutes.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/routes/authRoutes.ts), [`scheduleRoutes.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/routes/scheduleRoutes.ts), [`bookingRoutes.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/routes/bookingRoutes.ts), [`userRoutes.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/routes/userRoutes.ts)
  - [`src/middlewares/authMiddleware.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/middlewares/authMiddleware.ts), [`src/middlewares/errorMiddleware.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/middlewares/errorMiddleware.ts)
- **Core Files & Config**:
  - [`src/app.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/app.ts), [`src/server.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/server.ts), [`src/types/index.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/types/index.ts), [`src/utils/helpers.ts`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/src/utils/helpers.ts)
  - [`backend/package.json`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/package.json), [`backend/tsconfig.json`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/tsconfig.json), [`backend/.env.example`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/.env.example), [`backend/.gitignore`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/.gitignore), [`backend/README.md`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/backend/README.md)

---

### 3. Frontend Skeleton (`React + JavaScript`)
Located in [`frontend/`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend):

- **Pages**:
  - [`src/pages/LoginPage.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/pages/LoginPage.jsx): Email login.
  - [`src/pages/DashboardPage.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/pages/DashboardPage.jsx): Owner dashboard.
  - [`src/pages/ScheduleDetailPage.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/pages/ScheduleDetailPage.jsx): Management & requests.
  - [`src/pages/PublicBookingPage.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/pages/PublicBookingPage.jsx): Shareable attendee booking view.
  - [`src/pages/NotFoundPage.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/pages/NotFoundPage.jsx): 404 page.
- **Components**:
  - `components/common/`: [`Navbar.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/common/Navbar.jsx), [`Button.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/common/Button.jsx), [`Modal.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/common/Modal.jsx), [`Card.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/common/Card.jsx)
  - `components/schedule/`: [`ScheduleList.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/schedule/ScheduleList.jsx), [`ScheduleCard.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/schedule/ScheduleCard.jsx), [`CreateScheduleModal.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/schedule/CreateScheduleModal.jsx), [`ShareLinkModal.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/schedule/ShareLinkModal.jsx)
  - `components/booking/`: [`BookingForm.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/booking/BookingForm.jsx), [`BookingSlotPicker.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/booking/BookingSlotPicker.jsx), [`BookingRequestsList.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/components/booking/BookingRequestsList.jsx)
- **State & Hooks**:
  - [`src/context/AuthContext.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/context/AuthContext.jsx), [`src/context/ScheduleContext.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/context/ScheduleContext.jsx)
  - [`src/hooks/useAuth.js`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/hooks/useAuth.js), [`src/hooks/useSchedule.js`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/hooks/useSchedule.js)
- **Services & Utilities**:
  - [`src/services/api.js`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/services/api.js), [`authService.js`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/services/authService.js), [`scheduleService.js`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/services/scheduleService.js), [`bookingService.js`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/services/bookingService.js)
  - [`src/utils/helpers.js`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/utils/helpers.js)
- **Core Files & Config**:
  - [`public/index.html`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/public/index.html), [`src/assets/styles/index.css`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/assets/styles/index.css), [`src/App.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/App.jsx), [`src/main.jsx`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/src/main.jsx)
  - [`frontend/package.json`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/package.json), [`frontend/vite.config.js`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/vite.config.js), [`frontend/.env.example`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/.env.example), [`frontend/.gitignore`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/.gitignore), [`frontend/README.md`](file:///Users/felipeblasquezcontreras/Desktop/Archivos/2026-2/meeting-sheduler/frontend/README.md)
