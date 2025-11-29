const fs = require("fs");
const path = require("path");
const ConversationSession = require("../models/ConversationSession.model");
const SpeechScore = require("../models/SpeechScore.model");
const { transcribeAudio } = require("../services/stt.service");
const { generateBotReply } = require("../services/ai.service");
const { synthesizeSpeech } = require("../services/tts.service");
const { scorePronunciation } = require("../services/score.service");

// Simple in-memory scenario list - seed script will also insert into DB in future
const builtInScenarios = [
  { id: "interview", name: "Interview Practice" },
  { id: "casual", name: "Casual Conversation" },
  { id: "self-intro", name: "Self Introduction" },
  { id: "hr-round", name: "HR Round" },
  { id: "group-discussion", name: "Group Discussion" },
];

async function voiceChat(req, res) {
  try {
    const userId = req.user && req.user.id;
    const scenario = req.body.scenario || "casual";
    const voice = req.body.voice || "alloy";

    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "Audio file is required" });

    const mimeType = req.file.mimetype;
    const buffer = req.file.buffer;

    // 1. Transcribe user audio
    const stt = await transcribeAudio(buffer, mimeType, { userId });
    const userText = stt.text || "";

    // 2. Generate bot reply
    const bot = await generateBotReply(
      [{ role: "user", content: userText }],
      scenario
    );
    const botText = bot.text || "";

    // 3. Synthesize speech for bot reply
    const tts = await synthesizeSpeech(botText, voice);
    const audioBuffer = tts.audioBuffer || Buffer.from("");
    const contentType = tts.contentType || "audio/mpeg";

    // 4. Persist conversation - simple approach: create session and add two turns
    const session = new ConversationSession({
      user: userId || null,
      scenario,
      turns: [],
    });
    session.turns.push({ speaker: "user", text: userText });
    // Save bot audio to base64 or local file depending on storage config
    let audioUrl = null;
    if (
      process.env.STORAGE_PROVIDER &&
      process.env.STORAGE_PROVIDER !== "none"
    ) {
      // TODO: upload to S3/Cloudinary and set audioUrl
      audioUrl = "https://example.com/placeholder-bot-audio.mp3";
    } else {
      // Save locally (dev) to /tmp or server-communication/uploads
      const uploadsDir = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadsDir))
        fs.mkdirSync(uploadsDir, { recursive: true });
      const fileName = `bot-${Date.now()}.mp3`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, audioBuffer);
      audioUrl = `/uploads/${fileName}`; // note: static serving not configured, this is placeholder
    }
    session.turns.push({ speaker: "bot", text: botText, audioUrl });
    await session.save();

    // 5. Optionally evaluate pronunciation of user turn
    let latestScore = null;
    if (req.body.evaluate === "true" || req.query.evaluate === "true") {
      // Best effort: use stt.text and expected text if provided
      const expected = req.body.expectedText || "";
      const scoring = scorePronunciation(
        expected,
        userText,
        Number(req.body.duration) || 3
      );
      const scoreDoc = new SpeechScore({
        session: session._id,
        user: userId || null,
        ...scoring,
      });
      await scoreDoc.save();
      latestScore = scoring;
    }

    // Return base64 audio if storage not configured
    const responseAudio =
      process.env.STORAGE_PROVIDER && process.env.STORAGE_PROVIDER !== "none"
        ? { url: audioUrl }
        : { base64: audioBuffer.toString("base64"), contentType };

    return res
      .status(200)
      .json({
        userText,
        botText,
        botAudio: responseAudio,
        sessionId: session._id,
        latestScore,
      });
  } catch (err) {
    console.error("voiceChat error", err);
    return res
      .status(500)
      .json({ message: "voiceChat failed", error: err.message });
  }
}

async function pronunciationCheck(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "Audio file is required" });
    const mimeType = req.file.mimetype;
    const buffer = req.file.buffer;
    const expectedText = req.body.expectedText || "";
    const duration = Number(req.body.duration) || 3;

    const stt = await transcribeAudio(buffer, mimeType, { userId });
    const actualText = stt.text || "";

    const scoring = scorePronunciation(expectedText, actualText, duration);
    const scoreDoc = new SpeechScore({
      session: null,
      user: userId || null,
      ...scoring,
    });
    await scoreDoc.save();

    return res
      .status(200)
      .json({ score: scoring.pronunciation, details: scoring });
  } catch (err) {
    console.error("pronunciationCheck error", err);
    return res
      .status(500)
      .json({ message: "pronunciation check failed", error: err.message });
  }
}

async function getScenarios(req, res) {
  res.json({ scenarios: builtInScenarios });
}

module.exports = { voiceChat, pronunciationCheck, getScenarios };
