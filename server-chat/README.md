# ZOQIRA Chat Backend

A real-time chat application backend built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. Features include user profiles, Instagram-like chat requests, 1:1 and group chats, presence tracking, unread counts, and message read receipts.

## Features

- **User Management**: Profile creation, search, follow, verification
- **Chat Requests**: Send, accept, or reject initial chat requests before messaging
- **Direct Chats**: 1:1 messaging with request-based access control
- **Group Chats**: Create groups, invite members, admin controls
- **Real-time Updates**: Socket.IO for presence, typing indicators, message delivery
- **Message Management**: Read receipts, file attachments, message history pagination
- **Notifications**: In-app and email notifications for requests and messages
- **File Uploads**: Support for Cloudinary, AWS S3, or local storage
- **Authentication**: JWT-based with refresh tokens and httpOnly cookies

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone and Install

```bash
cd server-chat
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5002
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/zoqira-chat

# Client URL (for CORS and Socket.IO)
CLIENT_URL=http://localhost:3000
SOCKET_IO_ORIGIN=http://localhost:3000

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRE=30d

# Storage (local, cloudinary, or s3)
STORAGE_PROVIDER=local

# SMTP (for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@zoqira.com
```

### 3. Seed Database

```bash
npm run seed
```

This creates sample users and a group chat for testing.

Sample credentials:

- **Email**: alice@example.com | **Password**: password123
- **Email**: bob@example.com | **Password**: password123

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5002`

## API Endpoints

### Authentication

```bash
# Register
POST /api/auth/register
Body: { name, username, email, password }

# Login
POST /api/auth/login
Body: { email, password }

# Refresh token
POST /api/auth/refresh

# Logout
POST /api/auth/logout
```

### User Profile

```bash
# Get current user
GET /api/users/me
Headers: Authorization: Bearer <token>

# Get public profile
GET /api/users/:id

# Update profile
PATCH /api/users/me
Headers: Authorization: Bearer <token>
Body: { name, bio }
Files: avatar (optional)

# Search users
GET /api/users/search?q=john&limit=20
```

### Chat Rooms & Messages

#### Send Chat Request

```bash
POST /api/chat/rooms/direct/request
Headers: Authorization: Bearer <token>
Body: { toUserId, text: "Hi! Let's chat" }

# Response:
{
  "roomId": "60d5ec49c1234567890abcde",
  "message": {
    "id": "60d5ec49c1234567890abcdf",
    "text": "Hi! Let's chat",
    "requestStatus": "pending",
    "createdAt": "2024-11-29T10:00:00Z"
  }
}
```

#### Respond to Chat Request

```bash
POST /api/chat/rooms/direct/respond
Headers: Authorization: Bearer <token>
Body: { roomId, action: "accept" | "reject" }
```

#### Send Direct Message

```bash
POST /api/chat/rooms/direct/message
Headers: Authorization: Bearer <token>
Body: { roomId, text: "Hello!" }
Files: file (optional)
```

#### Create Group Chat

```bash
POST /api/chat/rooms/group
Headers: Authorization: Bearer <token>
Body: { name: "Team Chat", members: ["userId1", "userId2"] }
Files: avatar (optional)
```

#### Invite to Group

```bash
POST /api/chat/rooms/group/:roomId/invite
Headers: Authorization: Bearer <token>
Body: { newMembers: ["userId1", "userId2"] }
```

#### Send Group Message

```bash
POST /api/chat/rooms/group/:roomId/message
Headers: Authorization: Bearer <token>
Body: { text: "Hello team!" }
Files: file (optional)
```

#### Get Rooms

```bash
GET /api/chat/rooms
Headers: Authorization: Bearer <token>

# Response:
{
  "rooms": [
    {
      "roomId": "60d5ec49c1234567890abcde",
      "type": "direct",
      "name": "Alice Johnson",
      "members": [
        { "id": "userId1", "name": "Alice", "username": "alice_j", "avatar": "..." }
      ],
      "lastMessage": {
        "text": "See you later!",
        "senderId": "userId1",
        "createdAt": "2024-11-29T10:00:00Z"
      },
      "unreadCount": 2
    }
  ]
}
```

#### Get Message History

```bash
GET /api/chat/rooms/:roomId/messages?limit=50&before=<timestamp>
Headers: Authorization: Bearer <token>
```

#### Mark Messages as Read

```bash
POST /api/chat/rooms/:roomId/mark-read
Headers: Authorization: Bearer <token>
```

#### Leave Group

```bash
POST /api/chat/rooms/:roomId/leave
Headers: Authorization: Bearer <token>
```

#### Delete Group

```bash
DELETE /api/chat/rooms/:roomId
Headers: Authorization: Bearer <token>
```

## Socket.IO Events

### Client → Server

```javascript
// Connect with token
const socket = io("http://localhost:5002", {
  query: { token: "your_jwt_token" },
});

// Send message
socket.emit("message:send", { roomId, text: "Hello!" });

// Typing indicator
socket.emit("message:typing", { roomId });
socket.emit("message:typing-stop", { roomId });

// Mark as read
socket.emit("message:read", { roomId, messageIds: ["msgId1", "msgId2"] });

// Request events
socket.emit("request:sent", { toUserId, roomId });
socket.emit("request:responded", { fromUserId, roomId, action: "accept" });

// Group events
socket.emit("group:member-joined", { roomId });
socket.emit("group:member-left", { roomId });
```

### Server → Client

```javascript
// New message received
socket.on("message:new", (data) => {
  console.log("New message:", data.text);
});

// Typing indicator
socket.on("message:typing", (data) => {
  console.log(`${data.userId} is typing...`);
});

// Message read receipt
socket.on("message:read", (data) => {
  console.log("Read by:", data.userId);
});

// Presence update
socket.on("presence:update", (data) => {
  console.log(`User ${data.userId} is ${data.isOnline ? "online" : "offline"}`);
});

// Chat request notification
socket.on("request:notify", (data) => {
  console.log(`Chat request from user ${data.from}`);
});

// Request response
socket.on("request:response", (data) => {
  console.log(`Request ${data.action} by user ${data.to}`);
});

// Group events
socket.on("group:member-joined", (data) => {
  console.log(`User ${data.userId} joined the group`);
});

socket.on("group:member-left", (data) => {
  console.log(`User ${data.userId} left the group`);
});
```

## File Uploads

### Supported Storage Providers

1. **Local** (default): Saves to `/uploads` directory
2. **Cloudinary**: Configure in `.env`
3. **AWS S3**: Configure in `.env`

### Upload File with Message

```bash
POST /api/chat/rooms/direct/message
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
Body:
  roomId=roomId
  text=Check this out!
  file=@/path/to/image.jpg
```

## Scaling with Redis

For multi-instance deployment, configure Redis adapter:

1. Set `REDIS_URL` in `.env`:

   ```
   REDIS_URL=redis://localhost:6379
   ```

2. Install Redis adapter:

   ```bash
   npm install @socket.io/redis-adapter
   ```

3. Uncomment Redis configuration in `index.js`

## Security Notes

- Never commit `.env` file; keep secrets safe
- Use HTTPS and secure WebSocket (WSS) in production
- Set `secure: true` for cookies in production
- Implement rate limiting for APIs
- Validate all inputs and sanitize text messages
- Use strong JWT secrets
- Rotate keys periodically
- Enable CORS only for trusted origins

## Database Models

### User

- name, username, email, passwordHash, avatarUrl, bio, isVerified, roles, lastSeen, timestamps

### ChatRoom

- type (direct/group), members[], admins[], name, avatarUrl, isRequestBased, createdBy, lastMessage, timestamps

### Message

- room, sender, text, attachments[], system, requestStatus, readBy[], timestamps

### ChatRequest

- from, to, initialMessageId, status, timestamps

### Presence

- user, socketIds[], isOnline, lastSeen, timestamps

## Troubleshooting

### Socket.IO Connection Issues

- Verify `CLIENT_URL` and `SOCKET_IO_ORIGIN` match your client URL
- Check JWT token is being sent in handshake
- Enable CORS with correct origin

### File Upload Fails

- Check file size limits (50 MB default)
- Verify MIME type is allowed
- For Cloudinary/S3: ensure credentials in `.env`

### Messages Not Updating

- Ensure both users are in room members
- Check Socket.IO rooms are joined correctly (auto-joined on connection)
- Verify message is saved to database before emit

## Next Steps

1. Implement email verification for user registration
2. Add user blocking/muting functionality
3. Implement message search
4. Add message reactions (emoji)
5. Implement voice/video call integration (WebRTC)
6. Add message encryption end-to-end
7. Implement admin moderation panel
8. Add analytics and usage metrics

## License

MIT
