#!/bin/bash
echo "🚀 Student Life OS - Quick Start"
echo "================================"
echo ""

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker Compose found"
echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for database to be ready..."
sleep 5

echo ""
echo "Running database migrations..."
docker-compose exec -T backend python manage.py migrate

echo ""
echo "================================================"
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create an admin user:"
echo "   docker-compose exec backend python manage.py createsuperuser"
echo ""
echo "2. Access the application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000/api"
echo "   Admin:     http://localhost:8000/admin"
echo ""
echo "3. To stop services:"
echo "   docker-compose down"
echo "================================================"
