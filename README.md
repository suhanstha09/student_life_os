# Student Life OS - Full-Stack SaaS Application

A production-ready operating system for students combining focus tracking, assignment management, note-taking, learning logs, and productivity analytics.

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+

### Option 1: Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api
# Admin: http://localhost:8000/admin
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Create database
createdb studentlife

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Start development server
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
student-life-os/
├── backend/           # Django REST Framework API
├── frontend/          # Next.js application
├── docker-compose.yml
└── README.md
```

## Features

- **Assignments & Exams** - Track deadlines, priorities, and completion
- **Focus Sessions** - Pomodoro-style deep work tracking
- **Second Brain** - Note-taking with bidirectional links
- **Learning Logs** - Spaced repetition study tracking
- **Analytics** - Productivity insights and trends
- **Streaks** - Daily activity gamification

## Documentation

See `/docs` folder for detailed documentation on:
- API Reference
- Architecture
- Deployment Guide

## Tech Stack

**Backend:**
- Django 4.2 + Django REST Framework
- PostgreSQL
- JWT Authentication
- Celery + Redis

**Frontend:**
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Zustand (State Management)

## License

MIT
# student_life_os
