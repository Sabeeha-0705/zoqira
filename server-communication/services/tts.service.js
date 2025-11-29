const axios = require("axios");

/**
 * Synthesize speech for given text using configured TTS provider
 * Returns { audioBuffer, contentType }
 */
async function synthesizeSpeech(text, voice = "alloy", options = {}) {
  const provider = process.env.TTS_PROVIDER || "elevenlabs";

  if (provider === "elevenlabs" && process.env.ELEVENLABS_API_KEY) {
    // TODO: Replace with real ElevenLabs API integration
    // Example skeleton:
    // const res = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/...', { text }, { headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }, responseType: 'arraybuffer' });
    return { audioBuffer: Buffer.from(""), contentType: "audio/mpeg" };
  }

  if (provider === "google" && process.env.GOOGLE_TTS_KEY) {
    // TODO: Integrate Google Cloud Text-to-Speech REST API
    return { audioBuffer: Buffer.from(""), contentType: "audio/mp3" };
  }

  // Fallback: return empty buffer and indicate provider not configured
  return {
    audioBuffer: Buffer.from(""),
    contentType: "application/octet-stream",
  };
}

module.exports = { synthesizeSpeech };
