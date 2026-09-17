import { parseBackup, serializeBackup, type Lesson } from '@/db';

export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
export const MAX_DRIVE_BYTES = 5 * 1024 * 1024;
export type DriveBackup = {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
};
export type GoogleAccount = { sub: string; email: string; name: string };
export class GoogleSessionExpired extends Error {
  constructor() {
    super('Phiên Google đã hết hạn. Hãy đăng nhập lại.');
  }
}

const checked = async (response: Response) => {
  if (response.status === 401) throw new GoogleSessionExpired();
  if (response.status === 403)
    throw new Error(
      'Chưa có quyền truy cập Drive, API chưa được bật hoặc tài khoản đã hết hạn mức. Kiểm tra cấu hình và thử đăng nhập lại.',
    );
  if (!response.ok)
    throw new Error('Không thể kết nối Google Drive. Vui lòng thử lại.');
  return response;
};

export const createDriveClient = (
  token: string,
  fetcher: typeof fetch = fetch,
) => {
  const request = async (url: string, init: RequestInit = {}) =>
    checked(
      await fetcher(url, {
        ...init,
        signal: AbortSignal.timeout(30000),
        headers: { ...init.headers, Authorization: `Bearer ${token}` },
      }),
    );
  const getAccount = async (): Promise<GoogleAccount> => {
    const data = await (
      await request('https://www.googleapis.com/oauth2/v3/userinfo')
    ).json();
    if (typeof data.sub !== 'string' || typeof data.email !== 'string')
      throw new Error(
        'Không đọc được tài khoản Google. Hãy cấp quyền xem email khi đăng nhập.',
      );
    return {
      sub: data.sub,
      email: data.email,
      name: typeof data.name === 'string' ? data.name : data.email,
    };
  };
  const listBackups = async (): Promise<DriveBackup[]> => {
    const params = new URLSearchParams({
      spaces: 'appDataFolder',
      pageSize: '20',
      orderBy: 'modifiedTime desc',
      q: "trashed = false and appProperties has { key='app' and value='phrasebook' }",
      fields: 'files(id,name,modifiedTime,size)',
    });
    const data = await (
      await request(`https://www.googleapis.com/drive/v3/files?${params}`)
    ).json();
    if (!Array.isArray(data.files))
      throw new Error('Danh sách bản sao từ Drive không hợp lệ.');
    return data.files.filter(
      (file: DriveBackup) =>
        !!file &&
        typeof file.id === 'string' &&
        typeof file.name === 'string' &&
        typeof file.modifiedTime === 'string',
    );
  };
  const uploadBackup = async (lessons: Lesson[]): Promise<void> => {
    const text = serializeBackup(lessons);
    parseBackup(text);
    if (new Blob([text]).size > MAX_DRIVE_BYTES)
      throw new Error(
        'Bản sao vượt quá 5 MB. Hãy dùng Xuất file JSON để sao lưu trên máy.',
      );
    const boundary = `phrasebook_${crypto.randomUUID()}`;
    const metadata = {
      name: `phrasebook-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
      mimeType: 'application/json',
      parents: ['appDataFolder'],
      appProperties: { app: 'phrasebook' },
    };
    const body = new Blob(
      [
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${text}\r\n--${boundary}--`,
      ],
      { type: `multipart/related; boundary=${boundary}` },
    );
    await request(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      { method: 'POST', body },
    );
  };
  const downloadBackup = async (file: DriveBackup): Promise<Lesson[]> => {
    if (Number(file.size) > MAX_DRIVE_BYTES)
      throw new Error('Bản sao vượt quá giới hạn 5 MB.');
    const response = await request(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}?alt=media`,
    );
    if (Number(response.headers.get('content-length')) > MAX_DRIVE_BYTES) {
      await response.body?.cancel();
      throw new Error('Bản sao vượt quá giới hạn 5 MB.');
    }
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Không đọc được nội dung bản sao.');
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_DRIVE_BYTES) {
          await reader.cancel();
          throw new Error('Bản sao vượt quá giới hạn 5 MB.');
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const buffer = new Uint8Array(size);
    let offset = 0;
    chunks.forEach((chunk) => {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    });
    return parseBackup(new TextDecoder().decode(buffer));
  };
  return { getAccount, listBackups, uploadBackup, downloadBackup };
};
