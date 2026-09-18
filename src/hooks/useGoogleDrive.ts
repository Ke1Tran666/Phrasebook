import { useEffect, useRef, useState } from 'react';
import { db, type Lesson } from '@/db';
import {
  loadGoogleIdentity,
  requestGoogleToken,
  type GoogleToken,
} from '@/services/google-auth';
import {
  createDriveClient,
  GoogleSessionExpired,
  type DriveBackup,
  type GoogleAccount,
} from '@/services/google-drive';

type Session = GoogleToken & { account: GoogleAccount };
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? '';

export const useGoogleDrive = () => {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [backups, setBackups] = useState<DriveBackup[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const generation = useRef(0);
  const locked = useRef(false);

  const prepare = async () => {
    setError('');
    try {
      await loadGoogleIdentity();
      setReady(true);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  useEffect(() => {
    if (!clientId) return;
    let active = true;
    loadGoogleIdentity()
      .then(() => {
        if (active) setReady(true);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
      generation.current++;
      locked.current = false;
    };
  }, []);

  const disconnect = () => {
    generation.current++;
    locked.current = false;
    setSession(null);
    setBackups([]);
    setBusy(false);
    setError('');
    setMessage('');
  };
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(
      () => {
        disconnect();
        setError('Phiên Google đã hết hạn. Hãy đăng nhập lại.');
      },
      Math.max(0, session.expiresAt - Date.now() - 15000),
    );
    return () => clearTimeout(timer);
  }, [session]);

  const run = async <T>(task: () => Promise<T>, apply: (result: T) => void) => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    const id = ++generation.current;
    try {
      const result = await task();
      if (generation.current === id) apply(result);
    } catch (e) {
      if (generation.current !== id) return;
      if (e instanceof GoogleSessionExpired) {
        setSession(null);
        setBackups([]);
      }
      setError(
        e instanceof Error ? e.message : 'Không thể kết nối Google Drive.',
      );
    } finally {
      if (generation.current === id) {
        locked.current = false;
        setBusy(false);
      }
    }
  };
  const currentClient = () => {
    if (!session || session.expiresAt <= Date.now() + 15000)
      throw new GoogleSessionExpired();
    return createDriveClient(session.accessToken);
  };
  const connect = () => {
    if (!ready || !clientId) return;
    void run(
      async () => {
        const token = await requestGoogleToken(clientId);
        const api = createDriveClient(token.accessToken);
        const account = await api.getAccount();
        const files = await api.listBackups();
        return { session: { ...token, account }, files };
      },
      (result) => {
        setSession(result.session);
        setBackups(result.files);
      },
    );
  };
  const refresh = () =>
    void run(() => currentClient().listBackups(), setBackups);
  const backup = () =>
    void run(
      async () => {
        const api = currentClient();

        const result = await api.uploadBackup(await db.lessons.toArray());

        if (!result.created) {
          return {
            created: false,
            files: null,
          };
        }

        const files = await api.listBackups().catch(() => null);

        return {
          created: true,
          files,
        };
      },
      (result) => {
        if (!result.created) {
          setMessage(
            'Dữ liệu hiện tại đã được sao lưu. Không cần tạo bản sao mới.',
          );
          return;
        }

        if (result.files) {
          setBackups(result.files);
        }

        setMessage(
          result.files
            ? 'Đã tạo bản sao mới trên Google Drive.'
            : 'Đã sao lưu thành công, nhưng chưa cập nhật được danh sách. Bấm Làm mới để kiểm tra.',
        );
      },
    );
  const restore = (file: DriveBackup, onReady: (lessons: Lesson[]) => void) =>
    void run(() => currentClient().downloadBackup(file), onReady);

  return {
    configured: !!clientId,
    ready,
    account: session?.account,
    accessToken: session?.accessToken,
    backups,
    busy,
    error,
    message,
    prepare,
    connect,
    disconnect,
    refresh,
    backup,
    restore,
  };
};
