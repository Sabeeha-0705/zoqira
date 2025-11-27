# ZOQIRA Web Client

Modern React web application for ZOQIRA platform built with Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
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

3. Configure your `.env` file with the API URL

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
web-client/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/         # React Context (Auth, etc.)
│   │   └── AuthContext.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/       # API services
│   │   ├── api.js
│   │   └── auth.service.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## 🔐 Authentication

Authentication is handled through:
- **AuthContext** - Global auth state management
- **ProtectedRoute** - Route protection component
- **JWT Tokens** - Stored in localStorage
- **Axios Interceptors** - Automatic token attachment

### Protected Routes

Routes wrapped in `ProtectedRoute` require authentication:
- `/dashboard` - User dashboard (example)

### Public Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## 📡 API Integration

All API calls go through the `api.js` service which:
- Adds JWT token to requests automatically
- Handles 401 errors (redirects to login)
- Provides a centralized axios instance

## 🎨 Styling

Currently using inline styles for scaffolding. You can replace with:
- CSS Modules
- Styled Components
- Tailwind CSS
- Material-UI
- Any other styling solution

## 📦 Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Environment Variables

See `.env.example` for all required environment variables.

## 🤝 Contributing

Follow React best practices and component-based architecture when adding features.

