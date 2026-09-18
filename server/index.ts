import { createSpeechServer, googleSpeech } from './tts.ts';
const server = createSpeechServer({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
  emails: new Set(
    (process.env.TTS_ALLOWED_EMAILS || '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  ),
  ...googleSpeech(),
});
server.requestTimeout = 45000;
server.headersTimeout = 10000;
server.listen(Number(process.env.TTS_PORT || 3001), '127.0.0.1', () =>
  console.log(
    'Phrasebook TTS: http://127.0.0.1:' + (process.env.TTS_PORT || 3001),
  ),
);
