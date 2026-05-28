# VedaAI — Assessment Creator

A production-ready AI-powered assessment creation platform for educators, built exactly to the VedaAI specifications. Teachers describe what they need, and VedaAI generates structured, exam-quality question papers using Google Gemini.

---

## 🎯 Core Features Implemented

### 1. Assignment Creation (Frontend)
- **Dynamic Form**: Setup an exam with Subject, Grade, Total Marks, Due Date, and specific Question Configurations (MCQs, Short-Answer, Long-Answer).
- **Validation**: Strict validation (no negative values, no empty fields) using Zod.
- **State Management**: Zustand is used for clean, scalable state management across the app.
- **Marks Calculator**: Live validation to ensure the generated questions' marks match the Total Marks requested.

### 2. AI Question Generation
- **Structured Prompting**: Converts user input into a rigid JSON prompt for the LLM.
- **Intelligent Grouping**: Automatically divides the paper into logical sections (e.g., Section A, Section B).
- **Difficulty & Marks**: Every question generated includes a difficulty tag (Easy, Moderate, Challenging) and assigned marks.
- **No Raw LLM Output**: The frontend securely parses and renders the JSON; raw AI text is never directly shown to the user.

### 3. High-Performance Backend System
- **Node.js + Express (TypeScript)**
- **MongoDB**: Persistent storage for assignments and generated papers.
- **Redis + BullMQ**: Background jobs for AI generation, ensuring the API never hangs or drops requests.
- **WebSocket**: Real-time progress updates pushed directly to the frontend.

### 4. Output Page & UX (Figma Matched)
- **Beautiful Exam Layout**: Clean, readable layout mimicking a real exam paper.
- **Student Info Header**: Name, Roll Number, Class, Section.
- **Visual Badges**: Difficulty is highlighted visually with colored pill badges.
- **Answer Key**: Generated at the bottom of the paper for teachers.
- **Download as PDF**: Perfect `@media print` CSS strips the UI and generates a beautiful PDF natively.
- **Regenerate Action**: 1-click action bar button to discard the paper and generate a new one.

---

## 🏗 Architecture Overview

```
vedaai/
├── frontend/          # Next.js 14 App Router + TypeScript + Zustand
└── backend/           # Express + TypeScript + MongoDB + Redis + BullMQ
```

### System Flow
1. Teacher fills form → `POST /api/assignments`
2. Backend creates DB record → Adds job to `BullMQ`
3. Worker picks up job → Calls `Gemini 2.5 API`
4. Worker parses JSON response → Updates `MongoDB`
5. Worker emits `WebSocket` event → Frontend live-updates UI
6. Output page renders the beautifully structured paper.

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Zustand, Tailwind CSS, React Hook Form |
| **Backend** | Node.js, Express, TypeScript, Zod |
| **Database** | MongoDB |
| **Queue/Cache**| Redis + BullMQ |
| **AI Engine** | Google Gemini (2.5 Flash) |
| **Real-time** | `ws` (Native WebSockets) |
| **PDF Export** | Native Print CSS (`@media print`) |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### 1. Clone and Install
```bash
git clone <repo>
cd vedaai

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Environment Variables
```bash
# backend/.env
cp backend/.env.example backend/.env
# Fill in MONGODB_URI, REDIS_URL, GEMINI_API_KEY

# frontend/.env.local
cp frontend/.env.example frontend/.env.local
```

### 3. Start Infrastructure
```bash
docker-compose up -d  # Spins up MongoDB + Redis
```

### 4. Run Development Servers
```bash
# Terminal 1 - Backend (API + BullMQ Worker)
cd backend && npm run dev:all

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Frontend: http://localhost:3000  
Backend API: http://localhost:4000

---

## 🔒 Production Readiness
- **100% TypeScript**: Zero compilation errors.
- **Security**: Configured with `Helmet`, strict `CORS`, and robust global error handling.
- **Rate Limiting**: API routes protected via `express-rate-limit`.
- **Dockerized**: Ready for production containerization via `docker-compose.prod.yml`.
