# SkillExchange Platform

A full-stack web application where users exchange skills instead of money. A user who knows graphic design can offer logo work in exchange for coding help, language lessons, video editing, or any other skill — completely free.

---

## Features

- **JWT Authentication** — Register, login, logout, protected routes
- **User Profiles** — Profile image, bio, location, availability, reputation score
- **Skill Management** — Add offered/wanted skills with category and level
- **Smart Matching** — Auto-match users based on complementary skills
- **Exchange Requests** — Send, accept, reject, cancel, and complete exchanges
- **Reviews & Ratings** — Rate and review after completed exchanges
- **Reputation System** — Automatic score based on exchanges, ratings, and reviews
- **Notifications** — Real-time in-app notifications for all exchange activity
- **Dashboard** — Personal statistics, recent activity, quick actions
- **Admin Panel** — Django Admin for managing all data
- **Fully Responsive** — Clean, modern UI built with Tailwind CSS

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 19, React Router v7, Axios |
| Styling | Tailwind CSS v4 |
| Backend | Django 5.2, Django REST Framework 3.17 |
| Authentication | JWT (djangorestframework-simplejwt) |
| Database | PostgreSQL |
| File Uploads | Pillow (profile images) |

---

## Project Structure

```
Skill Exchange Platform/
├── backend/
│   ├── apps/
│   │   ├── accounts/        # User model, auth APIs
│   │   ├── skills/          # Skill model and APIs
│   │   ├── exchanges/       # Exchange request model and APIs
│   │   ├── reviews/         # Review model and APIs
│   │   └── notifications/   # Notification model and APIs
│   ├── skill_exchange/      # Django project settings
│   ├── media/               # Uploaded files
│   ├── manage.py
│   ├── seed_data.py         # Sample data script
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── api/             # Axios API clients
        ├── components/      # Reusable React components
        ├── context/         # AuthContext (global auth state)
        ├── pages/           # All application pages
        └── routes/          # App routing
```

---

## Database Schema

### User
| Field | Type |
|-------|------|
| id | BigAutoField (PK) |
| email | EmailField (unique) |
| username | CharField (unique) |
| full_name | CharField |
| profile_image | ImageField |
| bio | TextField |
| location | CharField |
| availability | CharField (available/busy/weekends_only) |
| reputation_score | FloatField |
| average_rating | FloatField |
| completed_exchanges_count | PositiveIntegerField |
| reviews_count | PositiveIntegerField |

### Skill
| Field | Type |
|-------|------|
| user | FK → User |
| name | CharField |
| category | CharField (14 choices) |
| skill_type | CharField (offered/wanted) |
| level | CharField (beginner/intermediate/advanced/expert) |
| description | TextField |

### ExchangeRequest
| Field | Type |
|-------|------|
| sender | FK → User |
| receiver | FK → User |
| requested_skill | FK → Skill |
| offered_skill | FK → Skill (optional) |
| message | TextField |
| status | CharField (pending/accepted/rejected/cancelled/in_progress/completed) |
| completed_at | DateTimeField |

### Review
| Field | Type |
|-------|------|
| exchange_request | FK → ExchangeRequest |
| reviewer | FK → User |
| reviewed_user | FK → User |
| rating | 1–5 |
| feedback | TextField |

### Notification
| Field | Type |
|-------|------|
| user | FK → User |
| title | CharField |
| message | TextField |
| is_read | BooleanField |

---

## Reputation System

```
Reputation Score = (Completed Exchanges × 10) + (Average Rating × 20) + (Positive Reviews × 5)
```

| Level | Score Range |
|-------|-------------|
| New Member | 0 – 49 |
| Trusted Member | 50 – 149 |
| Highly Rated Member | 150 – 299 |
| Expert Contributor | 300+ |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register/ | Register new user |
| POST | /api/auth/login/ | Login and get tokens |
| POST | /api/auth/logout/ | Blacklist refresh token |
| POST | /api/auth/token/refresh/ | Get new access token |
| GET/PUT | /api/auth/me/ | Get/update current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/ | List all users |
| GET | /api/users/:id/ | Get user profile |
| GET | /api/users/:id/reviews/ | Get user reviews |
| GET | /api/users/:id/skills/ | Get user skills |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/skills/ | List/create skills |
| GET/PUT/DELETE | /api/skills/:id/ | Manage skill |
| GET | /api/skills/my-skills/ | My skills |
| GET | /api/skills/search/ | Search skills |
| GET | /api/skills/matches/ | Personalized matches |

### Exchanges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/exchanges/ | List/create exchanges |
| GET | /api/exchanges/sent/ | My sent requests |
| GET | /api/exchanges/received/ | My received requests |
| GET | /api/exchanges/:id/ | Exchange details |
| PATCH | /api/exchanges/:id/accept/ | Accept request |
| PATCH | /api/exchanges/:id/reject/ | Reject request |
| PATCH | /api/exchanges/:id/cancel/ | Cancel request |
| PATCH | /api/exchanges/:id/complete/ | Mark completed |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/reviews/ | List/create reviews |
| GET | /api/reviews/:id/ | Review detail |
| GET | /api/reviews/user/:id/ | Reviews for a user |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notifications/ | All notifications |
| PATCH | /api/notifications/:id/read/ | Mark as read |
| PATCH | /api/notifications/read-all/ | Mark all as read |
| GET | /api/notifications/unread-count/ | Unread count |

---

## Installation & Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 14+
- Node.js 18+
- npm 9+

---

### 1. Clone & Navigate

```bash
git clone <repo-url>
cd "Skill Exchange Platform"
```

---

### 2. PostgreSQL Setup

Open your PostgreSQL client and run:

```sql
CREATE DATABASE skill_exchange_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE skill_exchange_db TO postgres;
```

---

### 3. Backend Setup

```bash
cd backend

# (Optional) Create virtual environment
py -m venv venv
venv\Scripts\activate

# Install dependencies
py -m pip install -r requirements.txt

# Configure environment variables
# Edit backend/.env with your database credentials:
# DATABASE_PASSWORD=your_postgres_password
```

**Edit `backend/.env`:**
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_NAME=skill_exchange_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

```bash
# Run migrations
py manage.py migrate

# Create Django superuser (for admin panel)
py manage.py createsuperuser

# Load sample data (optional but recommended)
py seed_data.py

# Start development server
py manage.py runserver
```

Backend runs at: **http://localhost:8000**  
Admin panel: **http://localhost:8000/admin/**

---

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Test Accounts

After running `seed_data.py`, use these credentials (password: `Password123!`):

| Name | Email | Username | Skills |
|------|-------|----------|--------|
| Ahmed Al-Rashidi | ahmed@example.com | ahmed_dev | Web Dev, Python |
| Sara Hassan | sara@example.com | sara_design | Logo Design, Graphic Design |
| Mohammed Al-Farsi | mohammed@example.com | mo_video | Video Editing |
| Lina Chen | lina@example.com | lina_english | English Tutoring |
| Omar Abdullah | omar@example.com | omar_data | Data Analysis |
| Fatima Malik | fatima@example.com | fatima_photo | Photography |
| Yusuf Al-Amin | yusuf@example.com | yusuf_music | Music, Guitar |
| Nadia Rousseau | nadia@example.com | nadia_market | Digital Marketing |
| Khalid Al-Mansouri | khalid@example.com | khalid_ui | UI/UX Design |
| Aisha Johnson | aisha@example.com | aisha_write | Content Writing |

---

## Pages

| Page | URL | Access |
|------|-----|--------|
| Home | / | Public |
| About | /about | Public |
| Browse Skills | /browse | Public |
| User Profile | /profile/:id | Public |
| Login | /login | Guest only |
| Register | /register | Guest only |
| Dashboard | /dashboard | Auth required |
| Edit Profile | /profile/edit | Auth required |
| My Skills | /my-skills | Auth required |
| Add/Edit Skill | /skills/add, /skills/edit/:id | Auth required |
| Search/Match | /search | Auth required |
| Exchanges | /exchanges | Auth required |
| Exchange Details | /exchanges/:id | Auth required |
| New Exchange | /exchanges/new | Auth required |
| Leave Review | /reviews/new/:exchangeId | Auth required |
| Notifications | /notifications | Auth required |

---

## Business Rules

1. Users cannot send an exchange request to themselves
2. Only the receiver can accept or reject a pending request
3. Only the sender can cancel a pending request
4. Exchanges follow strict status workflow: `Pending → Accepted → In Progress → Completed` or `Pending → Rejected/Cancelled`
5. Reviews can only be left after an exchange is completed
6. Each user can only leave one review per exchange
7. Users cannot review themselves
8. Reputation is recalculated automatically after each review and completed exchange

---

## Environment Variables

### Backend `.env`
```
SECRET_KEY=           # Django secret key
DEBUG=True
DATABASE_NAME=skill_exchange_db
DATABASE_USER=postgres
DATABASE_PASSWORD=    # Your PostgreSQL password
DATABASE_HOST=localhost
DATABASE_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Future Improvements

- Real-time notifications via WebSockets
- Chat/messaging between users
- Skill verification badges
- Advanced search with multiple filters
- Email notifications
- Mobile app (React Native)
- Skill endorsements from connections
- Exchange scheduling / calendar integration

---

## License

This project is built for academic and portfolio demonstration purposes.
