<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=TaskFlow&fontSize=80&fontAlignY=35&desc=Full-Stack%20Task%20Manager%20%7C%20React%20%2B%20Django%20%2B%20PostgreSQL&descAlignY=60&descAlign=50&fontColor=fff" />

**Organise. Prioritise. Deliver.**
*A sleek, full-stack task management app with real-time status tracking, search, filtering, pagination, and authentication — built with React + Django REST Framework + Neon PostgreSQL.*

### ⚡ Built for the Modern Developer Workflow

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-black?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Backend-Django%20REST-092E20?style=for-the-badge&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-Neon%20PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-Session%20Based-ff6b6b?style=for-the-badge&logo=shield&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Render%20%2B%20Vercel-000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

</div>

---

## ✨ Features

- ✅ **Full CRUD** — Create, edit, delete, and view tasks
- 🏷️ **Status Tracking** — Pending / In Progress / Completed (click to cycle)
- 🔍 **Search & Filter** — Live search by title/description, filter by status
- 📄 **Pagination** — 10 tasks per page
- 🔐 **Authentication** — Register, login, logout + guest mode
- 📱 **Responsive UI** — Works on mobile and desktop

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Axios |
| **Backend** | Django 4.2, Django REST Framework |
| **Database** | Neon PostgreSQL (via dj-database-url) |
| **Auth** | Django Session Authentication |
| **Deployment** | Render (backend) + Vercel (frontend) |

---

## 📁 Project Structure

```
taskflow/
├── taskmanager_backend/       # Django backend
│   ├── tasks/                 # Tasks app (models, views, serializers, urls)
│   ├── taskmanager_backend/   # Settings, root URLs
│   ├── .env.example           # Environment variable template
│   ├── requirements.txt
│   └── manage.py
│
└── taskmanager_frontend/      # React + Vite frontend
    ├── src/
    │   ├── App.jsx            # Main component
    │   ├── App.css            # Styles
    │   └── api.js             # Axios API calls
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- **Python 3.11+** → https://www.python.org/downloads/release/python-3119/
- **Node.js 18+** → https://nodejs.org
- **Neon account** → https://neon.tech (free tier works)

---

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

### 2. Backend setup

```bash
cd taskmanager_backend

# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your values:

```env
SECRET_KEY=your-long-random-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
```

> Get your `DATABASE_URL` from: **Neon Dashboard → Your Project → Connection Details → Connection string**

### 4. Run migrations & start backend

```bash
python manage.py migrate
python manage.py runserver
```

Backend live at → `http://localhost:8000`

---

### 5. Frontend setup

```bash
# In a new terminal
cd taskmanager_frontend

npm install
npm run dev
```

Frontend live at → `http://localhost:5173`

> The Vite proxy automatically forwards `/api` calls to Django on port 8000 — no extra config needed.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks/` | List tasks (supports `?search=` `?status=` `?page=`) |
| `POST` | `/api/tasks/` | Create a task |
| `PATCH` | `/api/tasks/{id}/` | Update a task |
| `DELETE` | `/api/tasks/{id}/` | Delete a task |
| `POST` | `/api/auth/register/` | Register new user |
| `POST` | `/api/auth/login/` | Login |
| `POST` | `/api/auth/logout/` | Logout |
| `GET` | `/api/auth/me/` | Current user info |

---

## ☁️ Deployment

### Backend → Render

1. Push `taskmanager_backend/` to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set these values:
   - **Root Directory:** `taskmanager_backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn taskmanager_backend.wsgi`
5. Add environment variables in Render dashboard:

```env
SECRET_KEY=your-long-random-secret-key
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

6. Click **Deploy** — Render will install deps and start the server
7. Run migrations via Render **Shell** tab:
```bash
python manage.py migrate
```

---

### Frontend → Vercel

1. Push `taskmanager_frontend/` to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repo
4. Set **Root Directory** to `taskmanager_frontend`
5. Add environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

6. Click **Deploy** ✅

---

### After Deployment — Update CORS

Go back to Render → Environment Variables → update:
```env
CORS_ALLOWED_ORIGINS=https://your-actual-frontend.vercel.app
```

---

## 🗂️ Task Model

```python
class Task(models.Model):
    title       = CharField(max_length=255)   # required
    description = TextField(blank=True)
    status      = CharField(choices=['pending', 'in_progress', 'completed'])
    created_at  = DateTimeField(auto_now_add=True)
    updated_at  = DateTimeField(auto_now=True)
    user        = ForeignKey(User, nullable=True)
```

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" />
  <p>Built with ❤️ by <a href="https://github.com/yourusername">Sarthak</a></p>
</div>
