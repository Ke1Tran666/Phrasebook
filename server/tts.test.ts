import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TokenInfo } from 'google-auth-library';
import { authorize, createSpeechServer, validateSpeech } from './tts.ts';

const info: TokenInfo = {
  aud: 'client',
  email: 'user@example.com',
  email_verified: true,
  expiry_date: Date.now() + 3600000,
  scopes: [],
};
const emails = new Set(['user@example.com']);
test('validate text byte limit and fixed voices/rates', () => {
  assert.equal(
    validateSpeech({ text: ' hello ', voice: 'en-US', rate: 1 }).text,
    'hello',
  );
  for (const input of [
    null,
    { text: '' },
    { text: 'é'.repeat(2501), voice: 'en-US', rate: 1 },
    { text: 'Hi', voice: 'ar-XA', rate: 1 },
    { text: 'Hi', voice: 'en-US', rate: 3 },
  ])
    assert.throws(() => validateSpeech(input));
});
test('authorization rejects wrong app, expired, unverified and unlisted accounts', () => {
  assert.equal(authorize(info, 'client', emails), 'user@example.com');
  for (const value of [
    { ...info, aud: 'other' },
    { ...info, expiry_date: 0 },
    { ...info, email_verified: false },
    { ...info, email: 'other@example.com' },
  ])
    assert.throws(() => authorize(value, 'client', emails));
});
test('HTTP validates auth and input before synthesis, limits calls, hides upstream errors', async () => {
  let calls = 0;
  const server = createSpeechServer({
    clientId: 'client',
    emails,
    verify: async (token) => {
      if (token === 'invalid') throw new Error('secret');
      return info;
    },
    synthesize: async (input) => {
      calls++;
      if (input.text === 'fail') throw new Error('secret credential');
      return Buffer.from('fake-mp3');
    },
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as { port: number };
  const url = `http://127.0.0.1:${address.port}/api/tts`;
  const send = (text = 'hello', token = 'valid') =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, voice: 'en-US', rate: 1 }),
    });
  try {
    assert.equal(
      (
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      ).status,
      401,
    );
    assert.equal((await send('hello', 'invalid')).status, 401);
    assert.equal((await send('')).status, 400);
    assert.equal(calls, 0);
    const result = await send();
    assert.equal(result.status, 200);
    assert.equal(result.headers.get('content-type'), 'audio/mpeg');
    assert.equal(await result.text(), 'fake-mp3');
    const failure = await send('fail');
    assert.equal(failure.status, 502);
    assert.ok(!(await failure.text()).includes('secret'));
    for (let i = 0; i < 8; i++) assert.equal((await send()).status, 200);
    assert.equal((await send()).status, 429);
    assert.equal(calls, 10);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
