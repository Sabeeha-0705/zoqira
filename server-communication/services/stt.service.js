const axios = require("axios");

/**
 * Transcribe audio buffer using configured provider
 * @param {Buffer} buffer
 * @param {string} mimeType
 * @param {object} options
 */
async function transcribeAudio(buffer, mimeType, options = {}) {
  // Default: try OpenAI/Whisper if WHISPER_KEY is provided
  if (process.env.WHISPER_KEY || process.env.OPENAI_API_KEY) {
    // TODO: implement proper multipart upload to OpenAI whisper endpoint
    // This is a skeleton showing how to call an HTTP API using axios
    // You may use `form-data` package to build the request body
    // For production, use the official SDK or follow provider docs.
    try {
      // Placeholder: return a dummy transcription
      return {
        text: "<transcribed text from whisper/openai>",
        rawProviderResponse: null,
      };
    } catch (err) {
      throw new Error("STT error (whisper): " + err.message);
    }
  }

  if (process.env.GOOGLE_CLOUD_SPEECH_KEY) {
    // TODO: implement Google Cloud Speech-to-Text REST call
    return {
      text: "<transcribed text from google>",
      rawProviderResponse: null,
    };
  }

  // Fallback: basic placeholder
  return {
    text: "<transcript unavailable - provider not configured>",
    rawProviderResponse: null,
  };
}

module.exports = { transcribeAudio };
