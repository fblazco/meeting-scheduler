# TutorSync - University Tutoring Meeting Scheduler (Frontend)

Modern, sleek React + Vite frontend client for the University Tutoring Meeting Scheduler.

## ✨ Features
- **Authentication**: Email registration & login with JWT persistence and user session recovery.
- **Tutor Dashboard**: Real-time stats, schedule creation, and calendar overview.
- **Dynamic Slot Generator**: Batch interval generator for fast office hours configuration.
- **Public Booking View**: Shareable unique invitation link (`/schedule/:linkToken`) for students.
- **Approval Workflow**: Owner review console to Accept or Reject student meeting requests.
- **Responsive UI**: Glassmorphic dark design system with Outfit/Plus Jakarta Sans typography.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy `/api` requests to the backend server at `http://localhost:5000`.
