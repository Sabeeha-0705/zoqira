# User Profile & Settings Module - Setup Guide

## Overview

This guide walks you through setting up and testing the new User Profile & Settings module for ZOQIRA.

## Module Components

### Models

- ✅ `UserSettings.model.js` - Comprehensive user settings and preferences
- ✅ Extended `User.model.js` - Added profile fields (bio, avatar, location, birthday, gender, username validation)

### Controllers

- ✅ `profile.controller.js` - Handle profile operations
  - `getPublicProfile()` - Get any user's public profile
  - `updateProfile()` - Update own profile
  - `uploadAvatar()` - Upload profile picture to Cloudinary
- ✅ `settings.controller.js` - Handle settings operations
  - `getSettings()` - Retrieve all user settings
  - `updateSettings()` - Update theme, language, preferences
  - `updatePrivacy()` - Update privacy settings
  - `updateNotifications()` - Update notification preferences

### Routes

- ✅ `settings.routes.js` - Settings endpoints

  - GET `/api/settings/me` - Get user settings
  - PATCH `/api/settings/me` - Update settings
  - PATCH `/api/settings/privacy` - Update privacy
  - PATCH `/api/settings/notifications` - Update notifications

- ✅ `profile.routes.js` - Profile endpoints
  - GET `/api/profile/:username` - Get public profile
  - PATCH `/api/profile/me` - Update own profile
  - POST `/api/profile/upload-avatar` - Upload avatar

### Middleware

- ✅ `validation.middleware.js` - Comprehensive input validation

### Configuration

- ✅ Updated `server.js` - Routes mounted
- ✅ Updated `package.json` - Added cloudinary and multer
- ✅ Updated `.env.example` - Added Cloudinary credentials

---

## Installation Steps

### Step 1: Install Dependencies

```bash
cd d:\zoqira\server
npm install
```

This installs the new packages:

- `multer` - File upload handling
- `cloudinary` - Cloud storage for avatars

### Step 2: Configure Environment Variables

Update your `.env` file with Cloudinary credentials:

```bash
# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**How to get Cloudinary credentials:**

1. Go to https://cloudinary.com/
2. Sign up for a free account
3. Go to Dashboard
4. Copy:
   - Cloud Name (shown under your avatar)
   - API Key (in Settings > API Keys)
   - API Secret (in Settings > API Keys)
5. Add them to your `.env` file

### Step 3: Database Setup

Ensure MongoDB is running and `MONGO_URI` is configured in `.env`.

### Step 4: Start the Server

```bash
npm run dev
```

You should see:

```
🚀 ZOQIRA Server running on port 5000
```

---

## API Testing

### 1. Get Settings

```bash
curl -X GET http://localhost:5000/api/settings/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### 2. Update Settings

```bash
curl -X PATCH http://localhost:5000/api/settings/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "language": "es",
    "preferences": {
      "aptitudeLevel": "advanced"
    }
  }'
```

### 3. Update Privacy Settings

```bash
curl -X PATCH http://localhost:5000/api/settings/privacy \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "privacy": {
      "whoCanMessage": "friends",
      "readReceipts": false,
      "showOnlineStatus": false
    }
  }'
```

### 4. Update Notifications

```bash
curl -X PATCH http://localhost:5000/api/settings/notifications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
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

### 5. Get Public Profile

```bash
curl -X GET http://localhost:5000/api/profile/johndoe \
  -H "Content-Type: application/json"
```

### 6. Update Profile

```bash
curl -X PATCH http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "bio": "Software engineer",
    "location": "San Francisco, CA",
    "birthday": "1990-05-15",
    "gender": "male"
  }'
```

### 7. Upload Avatar

```bash
curl -X POST http://localhost:5000/api/profile/upload-avatar \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "avatar=@/path/to/image.jpg"
```

---

## JavaScript/Frontend Integration

### Example React Hook

```javascript
import { useState, useEffect } from "react";

function UserSettings({ accessToken }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/settings/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setSettings(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setLoading(false);
    }
  };

  const updateTheme = async (theme) => {
    try {
      const response = await fetch("http://localhost:5000/api/settings/me", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme }),
      });
      const data = await response.json();
      setSettings(data.data);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Settings</h2>
      <select
        value={settings?.theme}
        onChange={(e) => updateTheme(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
      </select>
    </div>
  );
}

export default UserSettings;
```

### Upload Avatar

```javascript
async function uploadAvatar(file, accessToken) {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(
    "http://localhost:5000/api/profile/upload-avatar",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  const data = await response.json();
  return data.data.avatarUrl;
}
```

---

## File Structure

```
server/
├── models/
│   ├── User.model.js (✅ Extended)
│   └── UserSettings.model.js (✅ Created)
├── controllers/
│   ├── settings.controller.js (✅ Created)
│   └── profile.controller.js (✅ Created)
├── routes/
│   ├── settings.routes.js (✅ Created)
│   └── profile.routes.js (✅ Created)
├── middleware/
│   ├── validation.middleware.js (✅ Created)
│   └── auth.middleware.js (existing)
├── server.js (✅ Updated)
├── package.json (✅ Updated)
├── .env.example (✅ Updated)
└── PROFILE_SETTINGS_API.md (✅ Created)
```

---

## Validation Rules

### Settings Validation

- **theme**: `light`, `dark`, `auto`
- **language**: `en`, `es`, `fr`, `de`, `hi`, `ar`
- **aptitudeLevel**: `beginner`, `intermediate`, `advanced`
- **aiHistoryEnabled**: boolean

### Privacy Validation

- **whoCanMessage**: `everyone`, `friends`, `nobody`
- **readReceipts**: boolean
- **showOnlineStatus**: boolean
- **typingIndicator**: boolean

### Profile Validation

- **name**: 2-100 characters, required
- **bio**: max 500 characters
- **location**: max 100 characters
- **birthday**: valid ISO8601 date, user must be 13+
- **gender**: `male`, `female`, `other`, `not-specified`
- **username**: 3-30 characters, alphanumeric + underscore/hyphen

### File Upload Validation

- **Allowed formats**: JPEG, PNG, WebP, GIF
- **Max file size**: 10MB
- **Field name**: `avatar`

---

## Key Features

✅ **Comprehensive User Settings**

- Theme preferences (light/dark/auto)
- Language selection (6 languages)
- Notification controls (granular per event type)
- Privacy controls (messaging, read receipts, online status, typing)
- Voice bot customization
- Aptitude level preferences

✅ **Profile Management**

- Public profiles (view any user)
- Private profile updates
- Bio, location, birthday, gender
- Avatar upload to Cloudinary
- Full validation and error handling

✅ **Security**

- JWT authentication on all private endpoints
- Input validation with express-validator
- File upload restrictions (type, size)
- Automatic Cloudinary image optimization
- User-specific data isolation

✅ **Database**

- MongoDB models with indexes
- Automatic default settings creation
- Timestamps on all records
- Relationship references (User ↔ UserSettings)

---

## Troubleshooting

### Issue: "Cloudinary credentials not found"

**Solution**: Make sure `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set in `.env`

### Issue: "Validation error" on profile update

**Solution**: Check the validation rules above. Common issues:

- Bio exceeds 500 characters
- Birthday user is under 13 years old
- Invalid gender value
- Name is less than 2 characters

### Issue: "Token invalid or expired"

**Solution**: Get a fresh access token from `/api/auth/login`

### Issue: Avatar not uploading

**Solution**:

- Check file is an image (JPEG, PNG, WebP, GIF)
- Check file size is under 10MB
- Check Cloudinary credentials are correct

---

## Next Steps

1. ✅ Test all endpoints with cURL or Postman
2. ✅ Integrate with frontend (React/Expo)
3. ✅ Apply settings to UI (theme switching, language)
4. ✅ Implement privacy controls in chat module
5. ✅ Add more languages if needed
6. ✅ Implement user verification badges
7. ✅ Add profile follow/unfollow functionality

---

## Support

For issues or questions, refer to:

- API Documentation: `PROFILE_SETTINGS_API.md`
- Model Schema: Check `models/User.model.js` and `models/UserSettings.model.js`
- Controller Logic: Check `controllers/settings.controller.js` and `controllers/profile.controller.js`
