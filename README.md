# AI-Based Employee Performance Analytics & Recommendation System

> **ESE Examination AI (Blended) — AI Driven Full Stack Development (AI308B)**

A full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations using OpenRouter API.

## 🚀 Tech Stack
- **Frontend**: React + Vite, React Router, Axios, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js, JWT Auth, bcryptjs
- **Database**: MongoDB + Mongoose
- **AI**: OpenRouter API (OpenAI compatible)

## 📁 Folder Structure
```
employee-analytics/
├── backend/
│   ├── controllers/     # authController, employeeController, aiController
│   ├── middleware/      # authMiddleware, errorHandler
│   ├── models/          # Employee.js, User.js
│   ├── routes/          # authRoutes, employeeRoutes, aiRoutes
│   ├── .env
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # axios.js
        ├── components/   # Layout, EmployeeCard, EditEmployeeModal
        ├── context/      # AuthContext
        └── pages/        # Dashboard, Employees, AddEmployee, Search, AIRecommend
```

## 🔧 Setup

### Backend
```bash
cd backend
npm install
# Update .env with your MongoDB URI
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register HR/Admin user |
| POST | /api/auth/login | Login & get JWT token |
| GET | /api/auth/me | Get current user |
| POST | /api/employees | Add employee |
| GET | /api/employees | Get all employees |
| GET | /api/employees/search | Search/filter employees |
| GET | /api/employees/:id | Get employee by ID |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |
| POST | /api/ai/recommend | Get AI recommendation |
| POST | /api/ai/rank | Rank all employees |
