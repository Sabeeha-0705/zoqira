require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const ChatRoom = require("../models/ChatRoom.model");
const Message = require("../models/Message.model");
const { connectDB } = require("../config/db");

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await ChatRoom.deleteMany({});
    await Message.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      {
        name: "Alice Johnson",
        username: "alice_j",
        email: "alice@example.com",
        passwordHash: "password123",
        bio: "UX Designer | Coffee enthusiast",
        isVerified: true,
        avatarUrl: "https://via.placeholder.com/150?text=Alice",
      },
      {
        name: "Bob Smith",
        username: "bob_smith",
        email: "bob@example.com",
        passwordHash: "password123",
        bio: "Software Engineer | Open source fan",
        isVerified: true,
        avatarUrl: "https://via.placeholder.com/150?text=Bob",
      },
      {
        name: "Carol Davis",
        username: "carol_d",
        email: "carol@example.com",
        passwordHash: "password123",
        bio: "Product Manager | Tech enthusiast",
        isVerified: false,
        avatarUrl: "https://via.placeholder.com/150?text=Carol",
      },
      {
        name: "David Brown",
        username: "david_b",
        email: "david@example.com",
        passwordHash: "password123",
        bio: "Photographer | Traveler",
        isVerified: true,
        avatarUrl: "https://via.placeholder.com/150?text=David",
      },
    ]);

    console.log(`✓ Created ${users.length} sample users`);

    // Create a sample group chat
    const groupChat = await ChatRoom.create({
      type: "group",
      name: "ZOQIRA Team",
      members: users.map((u) => ({ user: u._id })),
      admins: [users[0]._id],
      createdBy: users[0]._id,
      avatarUrl: "https://via.placeholder.com/150?text=Team",
    });

    console.log(`✓ Created group chat: "${groupChat.name}"`);

    // Create sample messages in group
    const messages = await Message.insertMany([
      {
        room: groupChat._id,
        sender: users[0]._id,
        text: "Hey everyone! Welcome to the team chat 👋",
        readBy: [users[0]._id, users[1]._id, users[2]._id],
      },
      {
        room: groupChat._id,
        sender: users[1]._id,
        text: "Thanks for the invite! Excited to be here.",
        readBy: [users[0]._id, users[1]._id],
      },
      {
        room: groupChat._id,
        sender: users[2]._id,
        text: "Same here! Looking forward to working with everyone.",
        readBy: [users[0]._id, users[2]._id],
      },
    ]);

    console.log(`✓ Created ${messages.length} sample messages`);

    // Update group's last message
    groupChat.lastMessage = {
      text: messages[messages.length - 1].text,
      senderId: messages[messages.length - 1].sender,
      createdAt: messages[messages.length - 1].createdAt,
    };
    await groupChat.save();

    console.log(`\n✓ Database seeded successfully!`);
    console.log(`\nSample users created:`);
    users.forEach((u) => {
      console.log(`  - ${u.name} (${u.username}) | Email: ${u.email}`);
    });
    console.log(`\nYou can now log in with email and password "password123"`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedUsers();
