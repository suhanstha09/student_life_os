# Student Life OS - Setup Guide

## Quick Start (Docker - Recommended)

This is the easiest way to get the app running.

### 1. Prerequisites
- Docker and Docker Compose installed
- No other services running on ports 3000, 8000, or 5432

### 2. Start Everything
```bash
# From the project root
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis on port 6379
- Django backend on port 8000
- Next.js frontend on port 3000

### 3. Setup Database
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create admin user
docker-compose exec backend python manage.py createsuperuser
# Follow prompts to create your admin account
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

### 5. Stop Services
```bash
docker-compose down
```

---

## Manual Setup (Without Docker)

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Redis (optional, for future features)

### Backend Setup

1. **Create Database**
```bash
# Using PostgreSQL
createdb studentlife
```

2. **Setup Python Environment**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt
```

3. **Configure Environment**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
# At minimum, set:
# - SECRET_KEY (generate a random string)
# - DB_NAME=studentlife
# - DB_USER=your_postgres_username
# - DB_PASSWORD=your_postgres_password
```

4. **Run Migrations**
```bash
python manage.py migrate
```

5. **Create Superuser**
```bash
python manage.py createsuperuser
```

6. **Start Backend**
```bash
python manage.py runserver
```

Backend is now running at http://localhost:8000

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
```bash
cp .env.local.example .env.local
# The default settings should work
```

3. **Start Frontend**
```bash
npm run dev
```

Frontend is now running at http://localhost:3000

---

## Verification

### Test Backend
```bash
# Should return a 401 (authentication required)
curl http://localhost:8000/api/v1/assignments/assignments/

# Health check
curl http://localhost:8000/admin/
```

### Test Frontend
Open http://localhost:3000 in your browser.
You should see the welcome screen.

---

## Next Steps

1. **Create an Account**
   - Visit http://localhost:3000
   - Click "Sign Up"
   - Create your account

2. **Login**
   - Use your credentials to login
   - You'll be redirected to the dashboard

3. **Explore Features**
   - Create assignments
   - Start focus sessions
   - Take notes
   - Log learning

4. **Admin Panel**
   - Visit http://localhost:8000/admin
   - Login with your superuser credentials
   - Manage users and data

---

## Troubleshooting

### Backend Issues

**Problem**: `django.db.utils.OperationalError: could not connect to server`
**Solution**: Make sure PostgreSQL is running and credentials in `.env` are correct

**Problem**: `ModuleNotFoundError: No module named 'rest_framework'`
**Solution**: Make sure virtual environment is activated and dependencies installed

**Problem**: Port 8000 already in use
**Solution**: Kill the process or use a different port:
```bash
python manage.py runserver 8001
# Update NEXT_PUBLIC_API_URL in frontend/.env.local accordingly
```

### Frontend Issues

**Problem**: `npm install` fails
**Solution**: Try removing `node_modules` and `package-lock.json`, then reinstall

**Problem**: Can't connect to backend
**Solution**: Check that backend is running and `NEXT_PUBLIC_API_URL` in `.env.local` is correct

**Problem**: Port 3000 already in use
**Solution**: The dev server will offer to use a different port, or specify one:
```bash
npm run dev -- -p 3001
```

### Docker Issues

**Problem**: `docker-compose up` fails
**Solution**: Make sure Docker is running and no conflicting containers exist

**Problem**: Database connection refused
**Solution**: Wait a few seconds for PostgreSQL to fully start, then run migrations again

---

## Development Workflow

1. **Make Changes**
   - Backend: Django auto-reloads on file changes
   - Frontend: Next.js has hot module replacement

2. **Create Migrations** (if you modify models)
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

3. **Add Dependencies**
   - Backend: Add to `requirements/base.txt`, then `pip install -r requirements/development.txt`
   - Frontend: `npm install package-name`

---

## Production Deployment

See the documentation files for production deployment guides.

Quick notes:
- Use `config.settings.production` for Django
- Set proper environment variables
- Use `npm run build` for Next.js
- Configure HTTPS/SSL
- Use a process manager (gunicorn, systemd)
- Set up proper database backups

---

## Need Help?

- Check the documentation in `/docs`
- Review the code comments
- Check Django and Next.js official docs

Happy building! 🚀
