# ZOQIRA Backend Setup Checklist

✅ **Backend Scaffold Complete!** All core files have been created and updated.

## Files Created/Updated

### Models

- ✅ `server/models/User.model.js` - User authentication & profile schema
- ✅ `server/models/AptitudeQuestion.model.js` - Quiz questions schema
- ✅ `server/models/QuizAttempt.model.js` - User quiz attempt records
- ✅ `server/models/UserProgress.model.js` - Progress tracking & SRS

### Controllers

- ✅ `server/controllers/auth.controller.js` - Register, login, verify, tokens, password reset
- ✅ `server/controllers/user.controller.js` - Profile management
- ✅ `server/controllers/aptitude.controller.js` - Quiz & progress logic

### Routes

- ✅ `server/routes/auth.routes.js` - Auth endpoints
- ✅ `server/routes/user.routes.js` - User profile endpoints
- ✅ `server/routes/aptitude.routes.js` - Quiz & progress endpoints

### Middleware

- ✅ `server/middleware/auth.middleware.js` - JWT verification
- ✅ `server/middleware/error.middleware.js` - Global error handling

### Utils

- ✅ `server/utils/jwt.util.js` - Token generation/verification
- ✅ `server/utils/sendEmail.js` - Email sending (SMTP/OAuth2)

### Configuration

- ✅ `server/config/db.js` - MongoDB connection
- ✅ `server/.env.example` - Environment template
- ✅ `server/package.json` - Dependencies & scripts

### Scripts

- ✅ `server/scripts/seedAptitude.js` - Sample questions (30+)
- ✅ `server/scripts/test-email.js` - Email testing

### Documentation

- ✅ `server/README.md` - Comprehensive setup & API reference

## Quick Start (5 steps)

### 1. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secrets, SMTP credentials
```

### 2. Verify Dependencies

```bash
npm list --depth=0
# All packages should be installed (see above for list)
```

### 3. Seed Sample Data

```bash
npm run seed
# Inserts 30+ aptitude questions
```

### 4. Test Email (Optional)

```bash
npm run test-email
# Verifies SMTP/OAuth2 configuration
```

### 5. Start Server

```bash
# Development (auto-reload):
npm run dev

# OR Production:
npm start
```

Server runs at `http://localhost:5000`

## Environment Variables Required

```env
# Core
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/zoqira

# JWT (generate random strings, min 32 chars each)
JWT_SECRET=your_long_random_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRE=7d
REFRESH_EXPIRES=30d

# Clients
CLIENT_URL=http://localhost:5173
MOBILE_CLIENT_URL=http://localhost:19006

# Email (Gmail recommended - use App Password, not plain password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password_16_chars
EMAIL_FROM=no-reply@zoqira.com

# Optional: Admin emails for notifications
ADMIN_EMAILS=admin@zoqira.com,support@zoqira.com
```

## Test Endpoints

### 1. Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPass123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
# Returns: { accessToken, refreshToken (in cookie) }
```

### 3. Get Categories

```bash
curl http://localhost:5000/api/aptitude/categories
```

### 4. Get Questions

```bash
curl "http://localhost:5000/api/aptitude/topics/Arithmetic/questions?difficulty=easy&limit=5"
```

### 5. Submit Quiz (Protected)

```bash
curl -X POST http://localhost:5000/api/aptitude/attempts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "topic": "Arithmetic",
    "category": "quantitative",
    "duration": 300,
    "questions": [
      {"questionId": "...", "selectedOptionIndex": 0},
      {"questionId": "...", "selectedOptionIndex": 1}
    ]
  }'
```

## Scoring System

| Difficulty | Points |
| ---------- | ------ |
| Easy       | 10     |
| Medium     | 20     |
| Hard       | 30     |

### Levels

- Beginner: 0–199 points
- Intermediate: 200–499 points
- Advanced: 500+ points

## API Endpoints Summary

### Auth (`/api/auth`)

- `POST /register` - New user
- `POST /login` - Login
- `GET /me` - Current user (protected)
- `POST /logout` - Logout (protected)
- `POST /refresh` - Refresh token
- `GET /verify-email?token=...` - Verify email
- `POST /forgot-password` - Reset request
- `POST /reset-password` - Reset password

### Users (`/api/users`)

- `GET /me` - My profile (protected)
- `PATCH /me` - Update profile (protected)
- `GET /:id` - Public profile

### Aptitude (`/api/aptitude`)

- `GET /categories` - All categories & topics
- `GET /topics/:topic/questions?difficulty=easy&limit=5` - Questions
- `POST /attempts` - Submit quiz (protected)
- `GET /attempts?topic=Arithmetic` - My attempts (protected)
- `GET /progress` - My progress (protected)

## Troubleshooting

### Server Won't Start

1. Check `.env` MONGO_URI is valid
2. Verify Node.js version: `node --version` (v18+)
3. Check logs: Run `npm run dev` to see errors

### Email Not Sending

1. Verify SMTP credentials in `.env`
2. For Gmail: Use [App Password](https://support.google.com/accounts/answer/185833)
3. Test: `npm run test-email`

### JWT Errors

1. Ensure JWT_SECRET and JWT_REFRESH_SECRET are set in `.env`
2. Check token format in request header: `Authorization: Bearer <token>`

## Architecture Overview

```
Client (Web/Mobile)
       ↓
    Routes
  /api/auth
  /api/users
  /api/aptitude
       ↓
   Middleware
  (auth, error)
       ↓
  Controllers
  (business logic)
       ↓
    Models
  (schemas)
       ↓
   MongoDB
```

## Next Steps

- [ ] Deploy to production (Heroku, Railway, Render, etc.)
- [ ] Set up CI/CD pipeline
- [ ] Add rate limiting & caching
- [ ] Implement comprehensive tests
- [ ] Set up monitoring & logging
- [ ] Add admin dashboard
- [ ] Implement WebSocket for real-time features

## Security Checklist

- ✅ Helmet.js enabled (security headers)
- ✅ CORS configured
- ✅ JWT with separate access/refresh tokens
- ✅ bcryptjs password hashing
- ✅ httpOnly cookies for refresh tokens
- ✅ Input validation with express-validator
- ✅ Global error handler
- [ ] Rate limiting (to implement)
- [ ] Database encryption (to implement)
- [ ] API key authentication for external services (to implement)

---

**Setup Complete!** Your ZOQIRA backend is ready to use. 🚀

For questions or issues, refer to `server/README.md` for detailed documentation.
