# kumar-prakash-portfolio

Personal portfolio of a Full-Stack GenAI Engineer  
Built with React 19 (Vite 5, Material UI v7) + FastAPI + PostgreSQL + Google OAuth

This is a full-stack personal portfolio website showcasing projects, skills, and
contact information — with an admin panel for content management.

## Tech Stack

| Layer    | Technology                       |
| -------- | -------------------------------- |
| Frontend | React 19, Vite 5, Material UI v7 |
| State    | Zustand v4, React Router v6      |
| Backend  | FastAPI (Python 3.12+)           |
| Database | PostgreSQL 16 + SQLAlchemy async |
| Cache    | Redis 7                          |
| Storage  | MinIO (local) / AWS S3 (prod)    |
| Jobs     | Celery                           |
| Auth     | JWT + Google OAuth2              |

## Setup

> **Prerequisites:** Docker, Docker Compose, Node 20+, Python 3.12+

### 1. Clone and configure environment

```bash
git clone <repo-url>
cd personal-portfolio
cp .env.example .env
# Edit .env with your values
```

### 2. Start infrastructure

```bash
docker compose up -d postgres redis minio
```

### 3. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Run migrations

```bash
./backend/migrate.sh "your migration message"
```

## Project Structure

```
personal-portfolio/
├── backend/          # FastAPI application
├── frontend/         # React + Vite application
├── docker-compose.yml
└── README.md
```
