# ZOQIRA Backend API Server

A production-ready Node.js/Express backend for the ZOQIRA aptitude practice platform, featuring JWT authentication, user profiles, question/quiz management, progress tracking, and email notifications.

## Technologies Used

- **Node.js** + **Express.js** - REST API framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Access & refresh token authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending (SMTP or OAuth2)
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging

## Installation & Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zoqira
JWT_SECRET=your_long_random_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_EXPIRE=7d
REFRESH_EXPIRES=30d

CLIENT_URL=http://localhost:5173
MOBILE_CLIENT_URL=http://localhost:19006

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=no-reply@zoqira.com

NODE_ENV=development
```

**Important:**
- For Gmail: Use [App Password](https://support.google.com/accounts/answer/185833) (not plain password).
- **Never commit `.env`** — use `.env.example` for public repositories.
- For production: Use environment variables via hosting platform or secret manager.

### 3. Seed Sample Data

```bash
npm run seed
```

Inserts 30+ sample aptitude questions across 9 topics (Arithmetic, Geometry, Vocabulary, Reading Comprehension, Logical Reasoning, etc.).

### 4. Start the Server

**Development (with auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server will run at `http://localhost:5000`.

## Project Structure

```
server/
├── config/
│   └── db.js                      # MongoDB connection
├── controllers/
│   ├── auth.controller.js         # Register, login, verify, tokens
│   ├── user.controller.js         # Profile GET/PATCH
│   └── aptitude.controller.js     # Questions, quiz logic, progress
├── middleware/
│   ├── auth.middleware.js         # JWT verification
│   └── error.middleware.js        # Global error handler
├── models/
│   ├── User.model.js              # User schema
│   ├── AptitudeQuestion.model.js  # Quiz questions
│   ├── QuizAttempt.model.js       # Submitted attempts
│   └── UserProgress.model.js      # SRS & stats tracking
├── routes/
│   ├── auth.routes.js             # /api/auth/*
│   ├── user.routes.js             # /api/users/*
│   └── aptitude.routes.js         # /api/aptitude/*
├── scripts/
│   ├── seedAptitude.js            # Seed sample questions
│   └── test-email.js              # Test email sending
├── utils/
│   ├── jwt.util.js                # Token generation/verification
│   └── sendEmail.js               # Nodemailer wrapper
├── server.js                      # Main entry point
├── .env.example                   # Environment template
├── package.json                   # Dependencies
└── README.md                      # This file
```

## API Endpoints

### Auth (`/api/auth`)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/register` | POST | Register new user | No |
| `/login` | POST | Login with email/password | No |
| `/me` | GET | Get current user | Yes |
| `/refresh` | POST | Refresh access token | No |
| `/logout` | POST | Logout & invalidate token | Yes |
| `/verify-email` | GET | Verify email with token | No |
| `/forgot-password` | POST | Request password reset | No |
| `/reset-password` | POST | Reset password with token | No |

### Users (`/api/users`)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/me` | GET | Get my profile | Yes |
| `/me` | PATCH | Update my profile | Yes |
| `/:id` | GET | Get public user profile | No |

### Aptitude (`/api/aptitude`)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/categories` | GET | List categories & topics | No |
| `/topics/:topic/questions` | GET | Get questions by topic | No |
| `/attempts` | POST | Submit quiz attempt | Yes |
| `/attempts` | GET | Get my attempts | Yes |
| `/progress` | GET | Get my progress | Yes |

## Quick Examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "SecurePass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Categories

```bash
curl http://localhost:5000/api/aptitude/categories
```

### Get Questions by Topic

```bash
curl "http://localhost:5000/api/aptitude/topics/Arithmetic/questions?difficulty=easy&limit=5"
```

### Submit Quiz Attempt (Protected)

```bash
curl -X POST http://localhost:5000/api/aptitude/attempts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "topic": "Arithmetic",
    "category": "quantitative",
    "duration": 300,
    "questions": [
      {"questionId": "...", "selectedOptionIndex": 1},
      {"questionId": "...", "selectedOptionIndex": 2}
    ]
  }'
```

### Get My Progress (Protected)

```bash
curl -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/aptitude/progress
```

## Authentication Flow

1. **Register/Login** → receive `accessToken` (response) + `refreshToken` (cookie)
2. **API calls** → include `Authorization: Bearer <accessToken>` header
3. **Token expires** → use `POST /api/auth/refresh` to get new `accessToken`
4. **Logout** → `POST /api/auth/logout` (invalidates refresh token)

## Email Setup

### Gmail App Password (Recommended)

1. Enable [2-Step Verification](https://myaccount.google.com/security).
2. Generate [App Password](https://support.google.com/accounts/answer/185833):
   - Select "Mail" and "Windows Computer".
   - Copy the 16-character password.
3. Add to `.env`:
   ```env
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your_app_password_here
   ```

Test email:

```bash
npm run test-email
```

### Gmail OAuth2 (Optional)

For long-lived integration, use OAuth2:

1. Enable Gmail API in [Google Cloud Console](https://console.cloud.google.com).
2. Get credentials and refresh token from [OAuth Playground](https://developers.google.com/oauthplayground).
3. Add to `.env`:
   ```env
   SMTP_OAUTH_CLIENT_ID=...
   SMTP_OAUTH_CLIENT_SECRET=...
   SMTP_OAUTH_REFRESH_TOKEN=...
   ```

## Scoring & Progression

### Scoring System

- **Easy**: 10 points
- **Medium**: 20 points
- **Hard**: 30 points

### Level Assignment

- **Beginner**: 0–199 points
- **Intermediate**: 200–499 points
- **Advanced**: 500+ points

### Spaced Repetition (SRS)

- **Correct**: Next review in 1, 3, 7, or 14 days (based on streak)
- **Incorrect**: Streak resets; next review in 1 day

## Database Schemas

### User

```javascript
{
  name: String,
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  role: "student" | "admin",
  isVerified: Boolean,
  createdAt, updatedAt
}
```

### AptitudeQuestion

```javascript
{
  category: "verbal" | "quantitative" | "logical",
  topic: String,
  question: String,
  options: [String, String, String, String],
  correctOptionIndex: 0–3,
  difficulty: "easy" | "medium" | "hard",
  explanation: String,
  tags: [String],
  createdAt
}
```

### QuizAttempt

```javascript
{
  user: ObjectId (ref: User),
  topic: String,
  category: String,
  questions: [...],
  score: Number,
  pointsEarned: Number,
  createdAt, updatedAt
}
```

### UserProgress

```javascript
{
  user: ObjectId (ref: User, unique),
  topicStats: Map,
  totalPoints: Number,
  totalAttempts: Number,
  level: "beginner" | "intermediate" | "advanced"
}
```

## Security

- **Helmet.js** for security headers
- **CORS** whitelisting
- **JWT** access & refresh tokens
- **bcryptjs** password hashing
- **Input validation** with express-validator
- **httpOnly cookies** for refresh tokens
- **Secure flag** on cookies (production)

## Troubleshooting

### MongoDB Connection Error

Check `MONGO_URI` in `.env`. Format:

```
mongodb+srv://username:password@cluster.mongodb.net/zoqira
```

### Email Not Sending

1. Verify SMTP credentials.
2. For Gmail, use [App Password](https://support.google.com/accounts/answer/185833).
3. Run test: `npm run test-email`

### Token Invalid

- Expired access token? Use `POST /api/auth/refresh`.
- Invalid format? Ensure `Authorization: Bearer <token>` header.

## Future Features

- [ ] Google/GitHub OAuth
- [ ] Leaderboard & achievements
- [ ] Admin dashboard
- [ ] Real-time WebSocket
- [ ] Rate limiting & caching
- [ ] Comprehensive test suite

## License

ISC

## Author

ZOQIRA Team

---

**Need help?** Open an issue or email support@zoqira.com
