import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createDriveClient,
  DRIVE_SCOPE,
  GoogleSessionExpired,
  MAX_DRIVE_BYTES,
} from '@/services/google-drive';
import { exampleLessons, serializeBackup } from '@/db';
import { requestGoogleToken } from '@/services/google-auth';

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
const file = {
  id: 'backup-id',
  name: 'phrasebook.json',
  modifiedTime: '2026-09-17T00:00:00Z',
};

describe('Google Drive backups', () => {
  it('lists only Phrasebook application data, newest first, with authorization in headers', async () => {
    const fetcher: typeof fetch = async (url, init) => {
      const parsed = new URL(String(url));
      assert.equal(parsed.searchParams.get('spaces'), 'appDataFolder');
      assert.equal(parsed.searchParams.get('orderBy'), 'modifiedTime desc');
      assert.match(parsed.searchParams.get('q')!, /phrasebook/);
      assert.equal(
        new Headers(init?.headers).get('Authorization'),
        'Bearer test-token',
      );
      assert.ok(!String(url).includes('test-token'));
      return json({ files: [file] });
    };
    assert.deepEqual(
      await createDriveClient('test-token', fetcher).listBackups(),
      [file],
    );
  });
  it('creates a new multipart backup rather than overwriting earlier snapshots', async () => {
    const lessons = exampleLessons();
    const fetcher: typeof fetch = async (url, init) => {
      assert.match(String(url), /uploadType=multipart/);
      assert.equal(init?.method, 'POST');
      assert.ok(init?.body instanceof Blob);
      const body = await init.body.text();
      assert.match(body, /"parents":\["appDataFolder"\]/);
      assert.match(body, /"appProperties":\{"app":"phrasebook"\}/);
      assert.ok(body.includes(lessons[0].english));
      assert.match(init.body.type, /^multipart\/related; boundary=/);
      return json({ id: 'new-backup' });
    };
    await createDriveClient('token', fetcher).uploadBackup(lessons);
  });
  it('rejects invalid and oversized uploads before calling Google', async () => {
    let requests = 0;
    const api = createDriveClient('token', async () => {
      requests++;
      return json({});
    });
    const lesson = exampleLessons()[0];
    await assert.rejects(() => api.uploadBackup([{ ...lesson, english: '' }]));
    await assert.rejects(
      () =>
        api.uploadBackup(
          Array.from({ length: 110 }, () => ({
            ...lesson,
            notes: 'x'.repeat(50000),
          })),
        ),
      /5 MB/,
    );
    assert.equal(requests, 0);
  });
  it('validates downloaded JSON and preserves all lesson fields', async () => {
    const lessons = exampleLessons();
    const api = createDriveClient('token', async (url) => {
      assert.match(String(url), /backup-id\?alt=media/);
      return new Response(serializeBackup(lessons));
    });
    assert.deepEqual(await api.downloadBackup(file), lessons);
  });
  it('rejects corrupt and incompatible backups', async () => {
    await assert.rejects(
      () =>
        createDriveClient(
          'token',
          async () => new Response('bad json'),
        ).downloadBackup(file),
      /JSON/,
    );
    await assert.rejects(
      () =>
        createDriveClient('token', async () =>
          json({ app: 'other', version: 1, lessons: [] }),
        ).downloadBackup(file),
      /phiên bản/,
    );
  });
  it('rejects oversized metadata before downloading', async () => {
    let requests = 0;
    await assert.rejects(
      () =>
        createDriveClient('token', async () => {
          requests++;
          return json({});
        }).downloadBackup({ ...file, size: String(MAX_DRIVE_BYTES + 1) }),
      /5 MB/,
    );
    assert.equal(requests, 0);
  });
  it('bounds streamed downloads even without size headers', async () => {
    let cancelled = false;
    const response = new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(MAX_DRIVE_BYTES + 1));
        },
        cancel() {
          cancelled = true;
        },
      }),
    );
    await assert.rejects(
      () =>
        createDriveClient('token', async () => response).downloadBackup(file),
      /5 MB/,
    );
    assert.equal(cancelled, true);
  });
  it('reports token expiry separately from permission errors', async () => {
    await assert.rejects(
      () => createDriveClient('token', async () => json({}, 401)).listBackups(),
      GoogleSessionExpired,
    );
    await assert.rejects(
      () => createDriveClient('token', async () => json({}, 403)).listBackups(),
      /quyền/,
    );
    await assert.rejects(
      () => createDriveClient('token', async () => json({}, 500)).listBackups(),
      /thử lại/,
    );
  });
  it('reads and validates the account shown to the user', async () => {
    assert.deepEqual(
      await createDriveClient('token', async () =>
        json({ sub: '123', email: 'user@example.com', name: 'User' }),
      ).getAccount(),
      { sub: '123', email: 'user@example.com', name: 'User' },
    );
    await assert.rejects(
      () => createDriveClient('token', async () => json({})).getAccount(),
      /tài khoản/,
    );
  });
});

describe('Google OAuth token requests', () => {
  const withIdentity = async (
    response: Record<string, unknown>,
    check: (promise: ReturnType<typeof requestGoogleToken>) => Promise<void>,
    popupError?: string,
  ) => {
    const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        google: {
          accounts: {
            oauth2: {
              initTokenClient: (config: {
                scope: string;
                include_granted_scopes: boolean;
                callback: (value: unknown) => void;
                error_callback: (value: unknown) => void;
              }) => {
                assert.ok(config.scope.includes(DRIVE_SCOPE));
                assert.equal(config.include_granted_scopes, false);
                return {
                  requestAccessToken: (options: { prompt: string }) => {
                    assert.equal(options.prompt, 'select_account');
                    if (popupError) config.error_callback({ type: popupError });
                    else config.callback(response);
                  },
                };
              },
            },
          },
        },
      },
    });
    try {
      await check(requestGoogleToken('test-client-id'));
    } finally {
      if (previous) Object.defineProperty(globalThis, 'window', previous);
      else Reflect.deleteProperty(globalThis, 'window');
    }
  };
  it('accepts a granted Drive token with an expiry', async () => {
    await withIdentity(
      { access_token: 'token', expires_in: 3600, scope: DRIVE_SCOPE },
      async (promise) => {
        const result = await promise;
        assert.equal(result.accessToken, 'token');
        assert.ok(result.expiresAt > Date.now());
      },
    );
  });
  it('rejects missing Drive consent', async () => {
    await withIdentity(
      { access_token: 'token', expires_in: 3600, scope: 'openid email' },
      async (promise) => {
        await assert.rejects(promise, /Cần cấp quyền/);
      },
    );
  });
  it('handles rejected consent and a closed popup', async () => {
    await withIdentity({ error: 'access_denied' }, async (promise) => {
      await assert.rejects(promise, /chưa hoàn tất/);
    });
    await withIdentity(
      {},
      async (promise) => {
        await assert.rejects(promise, /Đã đóng/);
      },
      'popup_closed',
    );
  });
  it('rejects invalid token lifetimes', async () => {
    await withIdentity(
      { access_token: 'token', expires_in: 0, scope: DRIVE_SCOPE },
      async (promise) => {
        await assert.rejects(promise, /không hợp lệ/);
      },
    );
  });
});
