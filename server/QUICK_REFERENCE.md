# Quick Reference - Profile & Settings API

## 🔗 Base URL

```
http://localhost:5000/api
```

## 🔑 Authentication

All endpoints marked with 🔒 require JWT token:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## ⚙️ Settings Endpoints

### GET /settings/me 🔒

Get all user settings

```bash
curl -X GET http://localhost:5000/api/settings/me \
  -H "Authorization: Bearer <token>"
```

### PATCH /settings/me 🔒

Update theme, language, preferences

```bash
curl -X PATCH http://localhost:5000/api/settings/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "language": "es",
    "preferences": {
      "aptitudeLevel": "advanced",
      "aiHistoryEnabled": true
    }
  }'
```

**Valid Values**:

- `theme`: `light`, `dark`, `auto`
- `language`: `en`, `es`, `fr`, `de`, `hi`, `ar`
- `aptitudeLevel`: `beginner`, `intermediate`, `advanced`
- `aiHistoryEnabled`: `true` or `false`

### PATCH /settings/privacy 🔒

Update privacy settings

```bash
curl -X PATCH http://localhost:5000/api/settings/privacy \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "privacy": {
      "whoCanMessage": "friends",
      "readReceipts": false,
      "showOnlineStatus": false,
      "typingIndicator": true
    }
  }'
```

**Valid Values**:

- `whoCanMessage`: `everyone`, `friends`, `nobody`
- `readReceipts`: `true` or `false`
- `showOnlineStatus`: `true` or `false`
- `typingIndicator`: `true` or `false`

### PATCH /settings/notifications 🔒

Update notification settings

```bash
curl -X PATCH http://localhost:5000/api/settings/notifications \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notifications": {
      "messages": true,
      "calls": false,
      "groups": true,
      "friendRequests": false
    }
  }'
```

**Valid Values**: All fields are boolean (`true` or `false`)

---

## 👤 Profile Endpoints

### GET /profile/:username

Get public profile (no auth required)

```bash
curl -X GET http://localhost:5000/api/profile/johndoe
```

Response:

```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "username": "johndoe",
    "bio": "Software engineer",
    "avatarUrl": "https://...",
    "location": "San Francisco",
    "gender": "male",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PATCH /profile/me 🔒

Update your profile

```bash
curl -X PATCH http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "bio": "Software engineer and AI enthusiast",
    "location": "San Francisco, CA",
    "birthday": "1990-05-15",
    "gender": "male"
  }'
```

**Validation Rules**:

- `name`: 2-100 characters
- `bio`: max 500 characters
- `location`: max 100 characters
- `birthday`: ISO8601 date (user must be 13+)
- `gender`: `male`, `female`, `other`, `not-specified`

### POST /profile/upload-avatar 🔒

Upload profile picture

```bash
curl -X POST http://localhost:5000/api/profile/upload-avatar \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@/path/to/image.jpg"
```

**Requirements**:

- Field name: `avatar`
- Formats: JPEG, PNG, WebP, GIF
- Max size: 10MB

Response:

```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://res.cloudinary.com/...",
    "publicId": "zoqira/avatars/..."
  }
}
```

---

## ✅ Settings Schema

```javascript
{
  theme: "auto",
  language: "en",
  notifications: {
    messages: true,
    calls: true,
    groups: true,
    friendRequests: true
  },
  privacy: {
    whoCanMessage: "everyone",
    readReceipts: true,
    showOnlineStatus: true,
    typingIndicator: true
  },
  voiceBot: {
    language: "en",
    gender: "female",
    speed: 1
  },
  preferences: {
    aptitudeLevel: "intermediate",
    aiHistoryEnabled: true
  }
}
```

---

## ✅ Profile Schema

```javascript
{
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  bio: "Software engineer",
  avatarUrl: "https://...",
  location: "San Francisco",
  birthday: "1990-05-15",
  gender: "male",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

---

## 🚀 Quick Start

### 1. Install

```bash
npm install
```

### 2. Configure .env

```env
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 3. Start Server

```bash
npm run dev
```

### 4. Test Endpoints

Use the cURL commands above

---

## 🧪 JavaScript Examples

### Fetch Settings

```javascript
const response = await fetch("http://localhost:5000/api/settings/me", {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await response.json();
console.log(data.data);
```

### Update Theme

```javascript
await fetch("http://localhost:5000/api/settings/me", {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ theme: "dark" }),
});
```

### Upload Avatar

```javascript
const formData = new FormData();
formData.append("avatar", fileInput.files[0]);

const response = await fetch(
  "http://localhost:5000/api/profile/upload-avatar",
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }
);
const data = await response.json();
console.log(data.data.avatarUrl);
```

### Get Public Profile

```javascript
const response = await fetch("http://localhost:5000/api/profile/johndoe");
const data = await response.json();
console.log(data.data);
```

---

## ❌ Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 400 Validation Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "param": "theme",
      "msg": "Invalid theme value"
    }
  ]
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Server Error

```json
{
  "success": false,
  "message": "Error updating profile",
  "error": "Error details"
}
```

---

## 📱 Environment Variables

```env
# Required
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key

# Cloudinary (for avatar uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional
CLOUDINARY_FOLDER=zoqira/avatars
```

---

## 🎯 Common Tasks

### Change Theme to Dark

```javascript
fetch("http://localhost:5000/api/settings/me", {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ theme: "dark" }),
});
```

### Disable Read Receipts

```javascript
fetch("http://localhost:5000/api/settings/privacy", {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    privacy: { readReceipts: false },
  }),
});
```

### Restrict Messages to Friends Only

```javascript
fetch("http://localhost:5000/api/settings/privacy", {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    privacy: { whoCanMessage: "friends" },
  }),
});
```

### Update Profile Bio

```javascript
fetch("http://localhost:5000/api/profile/me", {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    bio: "New bio here",
  }),
});
```

---

## 📖 Complete Documentation

- **API Details**: See `PROFILE_SETTINGS_API.md`
- **Setup Guide**: See `PROFILE_SETTINGS_SETUP.md`
- **Module Summary**: See `PROFILE_SETTINGS_MODULE_SUMMARY.md`

---

## ⚡ Status

✅ All endpoints implemented and tested
✅ Full validation on all inputs
✅ JWT authentication on protected endpoints
✅ Cloudinary integration ready
✅ Complete API documentation provided
