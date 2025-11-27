# ZOQIRA Server API

Backend API server for ZOQIRA platform built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure your `.env` file with:
   - MongoDB connection string
   - JWT secret key
   - Port number
   - Client URLs

4. Start the server:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📁 Project Structure

```
server/
├── config/           # Configuration files (DB, etc.)
├── controllers/      # Route controllers (business logic)
├── middleware/       # Custom middleware (auth, error handling)
├── models/          # Database models (Mongoose schemas)
├── routes/          # API routes
├── utils/           # Helper functions
├── .env.example     # Environment variables template
├── server.js        # Entry point
└── package.json     # Dependencies
```

## 🔐 Authentication

All authentication endpoints are under `/api/auth`:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

## 📡 API Endpoints

### Auth Routes
- Authentication and user management

### User Routes
- User CRUD operations (Admin protected)

## 🛡️ Security Features

- Helmet.js for security headers
- CORS configured for specific origins
- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- Error handling middleware

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🧪 Testing

```bash
npm test
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **express-validator** - Request validation

## 🤝 Contributing

This is a production-level project structure. Follow the MVC pattern when adding new features.

