# ZOQIRA - Full Stack Project

A complete production-level monorepo for the ZOQIRA brand, featuring a Node.js backend, React web client, and React Native mobile app.

## 📁 Project Structure

```
zoqira/
├── server/              # Backend API (Node.js + Express + MongoDB)
├── web-client/          # Web Application (React + Vite)
├── app-client/          # Mobile Application (React Native + Expo)
└── README.md           # This file
```

## 🛠️ Tech Stack

### Backend (server/)
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Web Client (web-client/)
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Context API** - State management

### Mobile App (app-client/)
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **Axios** - HTTP client
- **expo-secure-store** - Secure storage

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or Atlas)
- **npm** or **yarn**
- **Expo CLI** (for mobile app)

### Installation & Setup

#### 1. Backend Server

```bash
cd server
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

The server will run on `http://localhost:5000`

See [server/README.md](server/README.md) for detailed instructions.

#### 2. Web Client

```bash
cd web-client
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

The web app will run on `http://localhost:5173`

See [web-client/README.md](web-client/README.md) for detailed instructions.

#### 3. Mobile App

```bash
cd app-client
npm install
# Update API URL in app.json with your local IP
npm start
```

Scan QR code with Expo Go app on your device.

See [app-client/README.md](app-client/README.md) for detailed instructions.

## 🏗️ Architecture

### Authentication Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│  Web Client │◄───────►│   Server    │◄───────►│   MongoDB   │
│             │   JWT   │   (API)     │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
                              ▲
                              │ JWT
                              │
                        ┌─────────────┐
                        │             │
                        │ App Client  │
                        │             │
                        └─────────────┘
```

- **Single Source of Truth**: All authentication handled by the backend
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Both clients implement route protection
- **Shared API**: Both frontends consume the same REST API

### API Structure

The backend follows a clean MVC architecture:

```
server/
├── config/         # Database and configuration
├── models/         # Mongoose schemas
├── controllers/    # Business logic
├── routes/         # API endpoints
├── middleware/     # Auth, error handling, etc.
└── utils/          # Helper functions
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout (Protected)

#### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id` - Update user (Protected)
- `DELETE /api/users/:id` - Delete user (Admin)

## 🔐 Security Features

- **Helmet.js** - Security headers
- **CORS** - Configured for specific origins
- **JWT** - Secure token-based auth
- **bcrypt** - Password hashing
- **Input Validation** - express-validator
- **Error Handling** - Centralized error middleware

## 🎯 Features

### Current (Scaffolding)
- ✅ Complete folder structure
- ✅ Authentication setup (backend + frontends)
- ✅ Protected routes implementation
- ✅ API service layer with interceptors
- ✅ Error handling
- ✅ Environment configuration

### To Be Implemented
- ⏳ Full authentication logic
- ⏳ User management features
- ⏳ UI/UX design
- ⏳ Additional business features
- ⏳ Testing suite
- ⏳ Deployment configuration

## 📝 Development Workflow

### 1. Start Backend
```bash
cd server && npm run dev
```

### 2. Start Web Client
```bash
cd web-client && npm run dev
```

### 3. Start Mobile App
```bash
cd app-client && npm start
```

## 🧪 Testing

Testing frameworks to be added:
- Backend: Jest + Supertest
- Web: Vitest + React Testing Library
- Mobile: Jest + React Native Testing Library

## 📦 Deployment

### Backend
- **Options**: Heroku, DigitalOcean, AWS, Railway
- **Database**: MongoDB Atlas (recommended)

### Web Client
- **Options**: Vercel, Netlify, AWS S3 + CloudFront

### Mobile App
- **iOS**: App Store (requires Apple Developer account)
- **Android**: Google Play Store
- **Build**: `expo build:ios` / `expo build:android`

## 🔧 Environment Variables

Each project has its own `.env.example` file. Copy and configure:

- **server/.env** - Server port, MongoDB URI, JWT secret
- **web-client/.env** - API URL
- **app-client/app.json** - API URL (under `extra.apiUrl`)

## 📚 Documentation

- [Server Documentation](server/README.md)
- [Web Client Documentation](web-client/README.md)
- [Mobile App Documentation](app-client/README.md)

## 🤝 Contributing

1. Follow the established folder structure
2. Maintain MVC pattern in backend
3. Use component-based architecture in frontends
4. Keep authentication logic in the backend only
5. Write clean, documented code

## 📄 License

ISC

## 👨‍💻 Next Steps

Choose your path:

### Option A: Backend First
Implement the full authentication and API logic:
- Complete auth controller logic
- Add validation middleware
- Implement JWT verification
- Add additional models and endpoints

### Option B: Frontend First
Create beautiful UI pages:
- Design landing pages
- Build dashboard components
- Create user profile pages
- Add responsive layouts

---

**Built with ❤️ for ZOQIRA**

