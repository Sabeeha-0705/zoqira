# ZOQIRA Mobile App

React Native mobile application for ZOQIRA platform built with Expo.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (iOS/Android)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `app.json`:
   - Find your computer's local IP address
   - Update the `extra.apiUrl` field in `app.json`
   - For Windows: Run `ipconfig` in terminal
   - For Mac/Linux: Run `ifconfig` in terminal

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## 📁 Project Structure

```
app-client/
├── src/
│   ├── context/         # React Context (Auth)
│   │   └── AuthContext.js
│   ├── screens/        # Screen components
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js
│   │   └── LoadingScreen.js
│   └── services/       # API services
│       ├── api.js
│       └── auth.service.js
├── assets/            # Images, fonts, etc.
├── App.js            # Main app component
├── app.json          # Expo configuration
├── babel.config.js   # Babel configuration
└── package.json      # Dependencies
```

## 🔐 Authentication

Authentication is handled through:
- **AuthContext** - Global auth state management
- **Navigation Guards** - Automatic screen switching based on auth state
- **Secure Storage** - JWT tokens stored securely with expo-secure-store
- **Axios Interceptors** - Automatic token attachment

### Navigation Flow

The app automatically switches between two navigation stacks:

**Public Stack** (Unauthenticated):
- Home Screen
- Login Screen
- Register Screen

**Protected Stack** (Authenticated):
- Dashboard Screen
- (Add more protected screens here)

## 🛠️ Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **Axios** - HTTP client
- **expo-secure-store** - Secure token storage
- **Context API** - State management

## 📡 API Integration

All API calls go through the `api.js` service which:
- Adds JWT token to requests automatically
- Handles 401 errors (auto-logout)
- Uses expo-secure-store for token management

### Important: API URL Configuration

When testing on a physical device, you **must** use your computer's local IP address, not `localhost`.

Update the `apiUrl` in `app.json`:
```json
"extra": {
  "apiUrl": "http://YOUR_IP_ADDRESS:5000/api"
}
```

## 📱 Running on Devices

### iOS Simulator (Mac only)
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Physical Device
```bash
npm start
```
Then scan the QR code with your device.

## 📦 Build for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## 🧪 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start in web browser
- `npm run lint` - Run ESLint

## 🎨 Styling

Currently using StyleSheet API (React Native's built-in styling solution).

## 🔧 Configuration

- **app.json** - Expo and app configuration
- **babel.config.js** - Babel configuration

## 🤝 Contributing

Follow React Native and Expo best practices when adding features.

## 📝 Notes

- Make sure the backend server is running before testing the app
- Update API URL when switching between development environments
- Tokens are stored securely using expo-secure-store (different from web localStorage)

