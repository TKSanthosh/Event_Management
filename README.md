# Event Management System

A full-stack Event Management System built with Node.js, Express, MongoDB, and React. Designed as a production-quality coding assessment demonstrating clean architecture, proper API design, validation, and a minimal responsive frontend.

---

## Features

### Backend
- JWT-based authentication (register, login, protected routes)
- Full CRUD for Events, Attendees, Venues, and Organizers
- Event capacity enforcement and duplicate detection
- Attendee event registration and cancellation
- Referential integrity (cannot delete venue/organizer with linked events)
- Centralized error handling with meaningful HTTP status codes
- Input validation using `express-validator`
- MVC pattern with a clean service layer
- In-memory TTL cache for venues and organizers list endpoints
- Rate limiting: global (500 req/15 min) and stricter auth limit (20 req/15 min)
- Security headers via `helmet`, gzip compression via `compression`
- Pagination support on events (`?page`, `?limit`, `?status`, `?date`)

### Frontend
- Login and Register pages
- Dashboard with summary statistics
- Management pages for Events, Attendees, Venues, and Organizers
- Modal-based CRUD forms
- Toast notifications (success/error)
- Protected routes via JWT stored in localStorage
- Responsive layout with Tailwind CSS

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios, Tailwind CSS, react-hot-toast |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB, Mongoose                   |
| Auth      | JWT (jsonwebtoken), bcryptjs        |
| Validation| express-validator                   |

---

## Folder Structure

```
event-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/               # Route handlers (thin layer)
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication guard
│   │   ├── errorHandler.js        # Centralized error handler
│   │   └── validate.js            # express-validator result checker
│   ├── models/                    # Mongoose schemas
│   ├── routes/                    # Express routers
│   ├── services/                  # Business logic layer
│   ├── utils/
│   │   ├── AppError.js            # Custom error class
│   │   ├── asyncHandler.js        # Async try/catch wrapper
│   │   ├── apiResponse.js         # Consistent response helpers
│   │   └── cache.js               # In-memory TTL cache (Map-based)
│   ├── validations/               # express-validator rule sets
│   ├── scripts/
│   │   └── seed.js                # Sample data seeder
│   ├── app.js                     # Express app setup
│   ├── server.js                  # Entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── common/            # Navbar, Sidebar, Modal, Loader
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state and actions
│   │   └── pages/                 # Login, Register, Dashboard, Events, Attendees, Venues, Organizers
│   ├── index.html
│   └── .env.example
├── postman/
│   └── EventManagement.postman_collection.json
└── README.md
```

---

## Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/event-management-system.git
cd event-management-system
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The backend runs on `http://localhost:5000` and frontend on `http://localhost:3000`.

### 4. Seed Sample Data (optional)

```bash
cd backend
npm run seed
```

Seed creates:
- 1 admin user: `admin@example.com` / `password123`
- 6 venues, 4 organizers, 8 events, 10 attendees (with 11 registrations wired up)

---

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                            | Default                              |
|-----------------|----------------------------------------|--------------------------------------|
| `PORT`          | Server port                            | `5000`                               |
| `MONGO_URI`     | MongoDB connection string              | `mongodb://localhost:27017/event_management` |
| `JWT_SECRET`    | Secret key for signing JWTs — generate one with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | *(required)* |
| `JWT_EXPIRES_IN`| Token expiry duration                  | `7d`                                 |
| `NODE_ENV`      | Environment (`development`/`production`) | `development`                      |

### Frontend (`frontend/.env`)

| Variable        | Description         | Default                        |
|-----------------|---------------------|--------------------------------|
| `VITE_API_URL`  | Backend API base URL | `http://localhost:5000/api`   |

---

## API Endpoints

### Authentication

| Method | Endpoint            | Auth | Description       |
|--------|---------------------|------|-------------------|
| POST   | `/api/auth/register`| No   | Register new user |
| POST   | `/api/auth/login`   | No   | Login user        |
| GET    | `/api/auth/me`      | Yes  | Get current user  |

### Events

| Method | Endpoint           | Auth | Description             |
|--------|--------------------|------|-------------------------|
| GET    | `/api/events`      | Yes  | List all events (`?status=upcoming`) |
| POST   | `/api/events`      | Yes  | Create event            |
| GET    | `/api/events/:id`  | Yes  | Get single event        |
| PUT    | `/api/events/:id`  | Yes  | Update event            |
| DELETE | `/api/events/:id`  | Yes  | Delete event            |

### Attendees

| Method | Endpoint                              | Auth | Description               |
|--------|---------------------------------------|------|---------------------------|
| GET    | `/api/attendees`                      | Yes  | List all attendees        |
| POST   | `/api/attendees`                      | Yes  | Create attendee           |
| GET    | `/api/attendees/:id`                  | Yes  | Get single attendee       |
| PUT    | `/api/attendees/:id`                  | Yes  | Update attendee           |
| DELETE | `/api/attendees/:id`                  | Yes  | Delete attendee           |
| POST   | `/api/attendees/:id/register/:eventId`| Yes  | Register for event        |
| DELETE | `/api/attendees/:id/cancel/:eventId`  | Yes  | Cancel event registration |

### Venues

| Method | Endpoint           | Auth | Description  |
|--------|--------------------|------|--------------|
| GET    | `/api/venues`      | Yes  | List venues  |
| POST   | `/api/venues`      | Yes  | Create venue |
| GET    | `/api/venues/:id`  | Yes  | Get venue    |
| PUT    | `/api/venues/:id`  | Yes  | Update venue |
| DELETE | `/api/venues/:id`  | Yes  | Delete venue |

### Organizers

| Method | Endpoint               | Auth | Description       |
|--------|------------------------|------|-------------------|
| GET    | `/api/organizers`      | Yes  | List organizers   |
| POST   | `/api/organizers`      | Yes  | Create organizer  |
| GET    | `/api/organizers/:id`  | Yes  | Get organizer     |
| PUT    | `/api/organizers/:id`  | Yes  | Update organizer  |
| DELETE | `/api/organizers/:id`  | Yes  | Delete organizer  |

### Response Format

All endpoints return a consistent structure:

```json
{
  "success": true,
  "message": "Events retrieved",
  "data": []
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

---

## Authentication Flow

1. User registers or logs in via `/api/auth/register` or `/api/auth/login`
2. Server returns a JWT token
3. Client stores the token in `localStorage`
4. All subsequent requests include `Authorization: Bearer <token>` header
5. `auth` middleware on the backend verifies the token and attaches `req.user`
6. On 401 response, the Axios interceptor clears the token and redirects to `/login`

---

## Database Schema

### User
```
name       String  required
email      String  required, unique
password   String  required, hashed (bcrypt)
```

### Venue
```
name       String  required
address    String  required
city       String  required
capacity   Number  required, min 1
```

### Organizer
```
name             String  required
email            String  required, unique
phone            String  required
organizationName String  required
```

### Event
```
title          String    required
description    String
date           Date      required
startTime      String    required (HH:MM)
endTime        String    required (HH:MM, must be > startTime)
venue          ObjectId  → Venue
organizer      ObjectId  → Organizer
attendees      [ObjectId → Attendee]
maxAttendees   Number    required
attendeesCount Number    auto-managed
status         String    enum: upcoming | completed | cancelled
```

### Attendee
```
name              String    required
email             String    required, unique
phone             String    required
registeredEvents  [ObjectId → Event]
```

**Relationships:**
- `Event.venue` → references `Venue`
- `Event.organizer` → references `Organizer`
- `Event.attendees` ↔ `Attendee.registeredEvents` (bidirectional, managed in service layer)

---


## Future Improvements

- Role-based access control (admin vs. viewer)
- Event image uploads (Cloudinary integration)
- Email notifications on registration (Nodemailer / SendGrid)
- Export attendee list to CSV
- Calendar view for events
- Refresh token rotation

---

## Assumptions

1. Authentication is app-level only — no role separation between users.
2. Phone validation accepts `+91` format (e.g. `+91 98765 43210`). Regex: `/^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/`.
3. `attendeesCount` is managed programmatically on register/cancel — not recalculated from `attendees.length` to allow eventual denormalization flexibility.
4. Events can be deleted even if they have registered attendees (registrations are orphaned, not cascade-deleted). This is intentional to keep the delete operation simple.
5. Frontend `.env` falls back to `http://localhost:5000/api` if `VITE_API_URL` is not set.
6. Seed script wipes all collections before inserting — intended for development use only.
