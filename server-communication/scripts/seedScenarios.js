const connectDB = require("../config/db");
const mongoose = require("mongoose");

const scenarios = [
  {
    id: "interview",
    name: "Interview Practice",
    description: "Practice common interview questions.",
  },
  {
    id: "casual",
    name: "Casual Conversation",
    description: "Small talk and daily conversation.",
  },
  {
    id: "self-intro",
    name: "Self Introduction",
    description: "Practice introducing yourself.",
  },
  {
    id: "hr-round",
    name: "HR Round",
    description: "Behavioral and HR questions.",
  },
  {
    id: "group-discussion",
    name: "Group Discussion",
    description: "Practice group discussion prompts.",
  },
];

async function seed() {
  await connectDB();
  const db = mongoose.connection.db;
  // For now we don't have a dedicated Scenario model. We'll just print them and exit.
  console.log("Default scenarios (not persisted)");
  scenarios.forEach((s) => console.log(JSON.stringify(s)));
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
