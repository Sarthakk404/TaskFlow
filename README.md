# TaskFlow — Full Stack Task Manager

A full-stack task management web app built with **React** (frontend) and **Django REST Framework** (backend).

---

## Features

- ✅ Create, edit, delete, and view tasks
- 🏷️ Task statuses: Pending / In Progress / Completed
- 🔍 Search tasks by title or description
- 🔽 Filter tasks by status
- 📄 Pagination (10 tasks per page)
- 🔐 User authentication (register / login / logout)
- 👤 Guest mode (no login required)
- 📱 Responsive UI

---

## Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18, Axios                |
| Backend   | Django 4, Django REST Framework|
| Database  | SQLite (dev) / PostgreSQL (prod)|
| Auth      | Django Session Authentication  |

---

## Project Structure

```
taskflow/
├── taskmanager_backend/     # Django backend
│   ├── tasks/               # Tasks app (models, views, serializers, urls)
│   ├── taskmanager_backend/ # Django settings and root urls
│   ├── manage.py
│   └── requirements.txt
│
└── taskmanager_frontend/    # React frontend
    ├── src/
    │   ├── App.js           # Main component
    │   ├── App.css          # Styles
    │   └── api.js           # Axios API calls
    └── package.json
```

---

## Local Setup

### Backend (Django)

```bash
cd taskmanager_backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# (Optional) Create a superuser for Django admin
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### Frontend (React)

```bash
cd taskmanager_frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at: `http://localhost:3000`

> The React app proxies API calls to `http://localhost:8000` via the `proxy` field in `package.json`.

---

## API Endpoints

| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| GET    | /api/tasks/            | List all tasks      |
| POST   | /api/tasks/            | Create a task       |
| GET    | /api/tasks/{id}/       | Get task detail     |
| PATCH  | /api/tasks/{id}/       | Update a task       |
| DELETE | /api/tasks/{id}/       | Delete a task       |
| POST   | /api/auth/register/    | Register user       |
| POST   | /api/auth/login/       | Login               |
| POST   | /api/auth/logout/      | Logout              |
| GET    | /api/auth/me/          | Current user info   |

### Query Parameters

- `?search=keyword` — Search by title or description
- `?status=pending|in_progress|completed` — Filter by status
- `?page=1` — Pagination

---

## Deployment

### Backend (Render / Railway / Heroku)

1. Add `gunicorn` and `psycopg2-binary` to requirements
2. Set environment variables: `SECRET_KEY`, `DATABASE_URL`, `ALLOWED_HOSTS`
3. Update `CORS_ALLOWED_ORIGINS` with frontend URL
4. Run: `gunicorn taskmanager_backend.wsgi`

### Frontend (Vercel / Netlify)

1. Set `REACT_APP_API_URL` environment variable to your backend URL
2. Run: `npm run build`
3. Deploy the `build/` folder

---

## Task Model

```python
class Task(models.Model):
    title       = CharField(max_length=255, required)
    description = TextField(blank=True)
    status      = CharField(choices=['pending', 'in_progress', 'completed'])
    created_at  = DateTimeField(auto_now_add=True)
    updated_at  = DateTimeField(auto_now=True)
    user        = ForeignKey(User, on_delete=CASCADE, nullable)
```

---

## Screenshots

The app features a dark sidebar layout with:
- Sidebar navigation with task counts per status
- Card grid for tasks with status badges
- Modal forms for creating/editing tasks
- Search bar with live filtering
