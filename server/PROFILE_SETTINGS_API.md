# User Profile & Settings Module - API Documentation

## Overview

This module provides comprehensive user profile management and settings configuration for the ZOQIRA platform.

## Features

- **User Profile Management**: Public and private profile endpoints
- **Settings Management**: Theme, language, and user preferences
- **Privacy Controls**: Fine-grained privacy settings
- **Notification Management**: Control notification preferences
- **Avatar Upload**: Cloudinary integration for profile pictures
- **Input Validation**: Express-validator for all endpoints

---

## Base URL

```
http://localhost:5000/api
```

---

## 1. Settings Endpoints

### 1.1 Get User Settings

Retrieve all user settings (theme, language, privacy, notifications, preferences).

**Endpoint**: `GET /settings/me`  
**Access**: Private (requires authentication)

**Headers**:

```
Authorization: Bearer <access_token>
```

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Settings retrieved successfully",
  "data": {
    "_id": "user_id",
    "user": "user_id",
    "theme": "auto",
    "language": "en",
    "notifications": {
      "messages": true,
      "calls": true,
      "groups": true,
      "friendRequests": true
    },
    "privacy": {
      "whoCanMessage": "everyone",
      "readReceipts": true,
      "showOnlineStatus": true,
      "typingIndicator": true
    },
    "voiceBot": {
      "language": "en",
      "gender": "female",
      "speed": 1
    },
    "preferences": {
      "aptitudeLevel": "intermediate",
      "aiHistoryEnabled": true
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Example cURL**:

```bash
curl -X GET http://localhost:5000/api/settings/me \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json"
```

---

### 1.2 Update Settings

Update theme, language, and user preferences.

**Endpoint**: `PATCH /settings/me`  
**Access**: Private (requires authentication)

**Request Body**:

```json
{
  "theme": "dark",
  "language": "es",
  "preferences": {
    "aptitudeLevel": "advanced",
    "aiHistoryEnabled": false
  }
}
```

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "_id": "user_id",
    "theme": "dark",
    "language": "es",
    "preferences": {
      "aptitudeLevel": "advanced",
      "aiHistoryEnabled": false
    }
  }
}
```

**Validation Rules**:

- `theme`: Must be one of: `light`, `dark`, `auto`
- `language`: Must be one of: `en`, `es`, `fr`, `de`, `hi`, `ar`
- `preferences.aptitudeLevel`: Must be one of: `beginner`, `intermediate`, `advanced`
- `preferences.aiHistoryEnabled`: Must be a boolean

**Example cURL**:

```bash
curl -X PATCH http://localhost:5000/api/settings/me \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "language": "es",
    "preferences": {
      "aptitudeLevel": "advanced"
    }
  }'
```

---

### 1.3 Update Privacy Settings

Update all privacy-related settings.

**Endpoint**: `PATCH /settings/privacy`  
**Access**: Private (requires authentication)

**Request Body**:

```json
{
  "privacy": {
    "whoCanMessage": "friends",
    "readReceipts": false,
    "showOnlineStatus": false,
    "typingIndicator": true
  }
}
```

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Privacy settings updated successfully",
  "data": {
    "whoCanMessage": "friends",
    "readReceipts": false,
    "showOnlineStatus": false,
    "typingIndicator": true
  }
}
```

**Validation Rules**:

- `privacy.whoCanMessage`: Must be one of: `everyone`, `friends`, `nobody`
- `privacy.readReceipts`: Must be a boolean
- `privacy.showOnlineStatus`: Must be a boolean
- `privacy.typingIndicator`: Must be a boolean

**Example cURL**:

```bash
curl -X PATCH http://localhost:5000/api/settings/privacy \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "privacy": {
      "whoCanMessage": "friends",
      "readReceipts": false
    }
  }'
```

---

### 1.4 Update Notification Settings

Configure notification preferences for different event types.

**Endpoint**: `PATCH /settings/notifications`  
**Access**: Private (requires authentication)

**Request Body**:

```json
{
  "notifications": {
    "messages": true,
    "calls": false,
    "groups": true,
    "friendRequests": false
  }
}
```

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Notification settings updated successfully",
  "data": {
    "messages": true,
    "calls": false,
    "groups": true,
    "friendRequests": false
  }
}
```

**Validation Rules**:

- All notification fields must be boolean values

**Example cURL**:

```bash
curl -X PATCH http://localhost:5000/api/settings/notifications \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "notifications": {
      "messages": true,
      "calls": false
    }
  }'
```

---

## 2. Profile Endpoints

### 2.1 Get Public Profile

Retrieve a user's public profile information by username.

**Endpoint**: `GET /profile/:username`  
**Access**: Public (no authentication required)

**URL Parameters**:

- `username` (string, required): User's username (3-30 characters)

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "bio": "Software engineer passionate about AI",
    "avatarUrl": "https://res.cloudinary.com/...",
    "location": "San Francisco, CA",
    "gender": "male",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response (404)**:

```json
{
  "success": false,
  "message": "User not found"
}
```

**Example cURL**:

```bash
curl -X GET http://localhost:5000/api/profile/johndoe \
  -H "Content-Type: application/json"
```

---

### 2.2 Update Own Profile

Update authenticated user's profile information.

**Endpoint**: `PATCH /profile/me`  
**Access**: Private (requires authentication)

**Request Body**:

```json
{
  "name": "John Doe",
  "bio": "Software engineer and AI enthusiast",
  "location": "San Francisco, CA",
  "birthday": "1990-05-15",
  "gender": "male"
}
```

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Software engineer and AI enthusiast",
    "avatarUrl": "https://res.cloudinary.com/...",
    "location": "San Francisco, CA",
    "birthday": "1990-05-15T00:00:00Z",
    "gender": "male"
  }
}
```

**Validation Rules**:

- `name`: 2-100 characters, cannot be empty
- `bio`: Maximum 500 characters
- `location`: Maximum 100 characters
- `birthday`: Valid ISO8601 date, user must be at least 13 years old
- `gender`: Must be one of: `male`, `female`, `other`, `not-specified`

**Example cURL**:

```bash
curl -X PATCH http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "bio": "Software engineer and AI enthusiast",
    "location": "San Francisco, CA",
    "birthday": "1990-05-15",
    "gender": "male"
  }'
```

---

### 2.3 Upload Avatar

Upload a profile avatar image to Cloudinary.

**Endpoint**: `POST /profile/upload-avatar`  
**Access**: Private (requires authentication)

**Request**:

- Content-Type: `multipart/form-data`
- Form field name: `avatar`
- File types: JPEG, PNG, WebP, GIF
- Max file size: 10MB

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatarUrl": "https://res.cloudinary.com/dxxxx/image/upload/v1704067200/zoqira/avatars/xxxxx.webp",
    "publicId": "zoqira/avatars/xxxxx"
  }
}
```

**Error Response (400)**:

```json
{
  "success": false,
  "message": "Only image files are allowed (JPEG, PNG, WebP, GIF)"
}
```

**Example cURL**:

```bash
curl -X POST http://localhost:5000/api/profile/upload-avatar \
  -H "Authorization: Bearer your_token_here" \
  -F "avatar=@/path/to/image.jpg"
```

**Example JavaScript (Fetch API)**:

```javascript
const formData = new FormData();
formData.append("avatar", fileInput.files[0]);

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
console.log(data.data.avatarUrl);
```

---

## Error Responses

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

### 500 Server Error

```json
{
  "success": false,
  "message": "Error updating profile",
  "error": "Database connection failed"
}
```

---

## Authentication

All private endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### How to get an access token:

1. Register a new user via `/api/auth/register`
2. Login via `/api/auth/login` to receive an `accessToken`
3. Include the token in all protected endpoint requests

---

## User Settings Schema

```javascript
{
  user: ObjectId,                    // Reference to User
  theme: String,                     // light, dark, auto
  language: String,                  // en, es, fr, de, hi, ar
  notifications: {
    messages: Boolean,
    calls: Boolean,
    groups: Boolean,
    friendRequests: Boolean
  },
  privacy: {
    whoCanMessage: String,           // everyone, friends, nobody
    readReceipts: Boolean,
    showOnlineStatus: Boolean,
    typingIndicator: Boolean
  },
  voiceBot: {
    language: String,                // en, es, fr, de, hi
    gender: String,                  // male, female
    speed: Number                    // 0.5 - 2.0
  },
  preferences: {
    aptitudeLevel: String,           // beginner, intermediate, advanced
    aiHistoryEnabled: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## User Profile Extensions

The User model has been extended with these new fields:

```javascript
{
  // Existing fields (name, email, username, password, role, etc.)

  // New profile fields
  bio: String,                       // Max 500 characters
  avatarUrl: String,                // Cloudinary URL
  location: String,                 // Max 100 characters
  birthday: Date,
  gender: String                    // male, female, other, not-specified
}
```

---

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB database
- Cloudinary account (for avatar uploads)

### Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Configure environment variables** in `.env`:

```env
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. **Get Cloudinary credentials**:

   - Sign up at https://cloudinary.com/
   - Go to Dashboard
   - Copy your Cloud Name, API Key, and API Secret
   - Add them to `.env` file

4. **Start the server**:

```bash
npm run dev
```

---

## Testing

### Test with Postman

1. Import the endpoints into Postman
2. Set the `Authorization` header with your Bearer token
3. Send requests to test the endpoints

### Test with JavaScript

```javascript
// Get settings
const response = await fetch("http://localhost:5000/api/settings/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const settings = await response.json();

// Update settings
const updateResponse = await fetch("http://localhost:5000/api/settings/me", {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    theme: "dark",
    language: "es",
  }),
});
```

---

## Best Practices

1. **Always include authentication token** for protected endpoints
2. **Validate file uploads** - only image files are accepted for avatars
3. **Respect privacy settings** - check `whoCanMessage` before messaging
4. **Handle settings gracefully** - default settings are created automatically
5. **Update frontend UI** - reflect the current theme and language settings
6. **Cache user settings** - minimize repeated API calls by storing settings locally

---

## Troubleshooting

### Cloudinary upload fails

- Check `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are correct
- Ensure account has permissions for image upload
- Verify file size is under 10MB

### Username not found

- Usernames are case-insensitive and stored in lowercase
- Check spelling and special characters
- Username must be 3-30 characters

### Settings not updating

- Ensure all fields match the correct enum values
- Check request body format is valid JSON
- Verify authentication token is valid

---

## Future Enhancements

- [ ] Profile verification badges
- [ ] Social links on profile (GitHub, LinkedIn, Twitter)
- [ ] User activity feed
- [ ] Profile themes/customization
- [ ] Two-factor authentication settings
- [ ] Account deletion endpoint
- [ ] Export user data (GDPR compliance)
