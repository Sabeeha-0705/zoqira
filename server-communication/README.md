# ZOQIRA Communication Backend

This repository is the backend-only scaffold for the ZOQIRA Communication module (AI voice bot, pronunciation & conversation). It is intentionally provider-agnostic with TODOs where you should wire real STT/TTS/AI providers.

Quick start:

1. Copy `.env.example` to `.env` and fill placeholders.
2. Install dependencies:

```bash
cd server-communication
npm install
```

3. Seed default scenarios (prints to console for now):

```bash
npm run seed
```

4. Start in dev mode (nodemon):

```bash
npm run dev
```

Endpoints:

- `POST /api/communication/voice-chat` - multipart form `audio` (file), optional `scenario`, `evaluate` flag. Requires Authorization: Bearer <token> (routes currently require protect middleware).
- `POST /api/communication/pronunciation-check` - multipart form `audio` (file), `expectedText` optional.
- `GET /api/communication/scenarios` - list built-in scenarios.

Note: For development the server saves synthesized bot audio under `server-communication/uploads` and returns base64 in responses when storage provider is not configured.

Provider integration notes:

- STT: Implement OpenAI whisper or Google Cloud Speech in `services/stt.service.js`.
- TTS: Implement ElevenLabs / Google / Azure in `services/tts.service.js`.
- AI: Implement OpenAI or local LLM in `services/ai.service.js`.
- Storage: Implement S3 or Cloudinary upload in controllers where TODO comments are present.

Security:

- Keep your `.env` out of version control.
- Rotate API keys regularly.

Example curl (voice-chat):

```bash
curl -X POST "http://localhost:5001/api/communication/voice-chat" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "audio=@/path/to/your.wav" \
  -F "scenario=interview"
```

Example curl (pronunciation check):

```bash
curl -X POST "http://localhost:5001/api/communication/pronunciation-check" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "audio=@/path/to/your.wav" \
  -F "expectedText=Hello, my name is John"
```

For details see service TODOs in `services/` directory.
