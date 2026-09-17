import { DRIVE_SCOPE } from '@/services/google-drive';

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
};
export type GoogleToken = { accessToken: string; expiresAt: number };
type GoogleIdentity = {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        include_granted_scopes: boolean;
        callback: (response: TokenResponse) => void;
        error_callback: (error: { type: string }) => void;
      }) => { requestAccessToken: (options: { prompt: string }) => void };
    };
  };
};
const identity = () => (window as Window & { google?: GoogleIdentity }).google;
let loading: Promise<void> | undefined;

export const loadGoogleIdentity = (): Promise<void> => {
  if (identity()?.accounts.oauth2) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      loading = undefined;
      reject(
        new Error(
          'Không tải được đăng nhập Google. Kiểm tra mạng hoặc trình chặn nội dung rồi thử lại.',
        ),
      );
    };
    const timer = setTimeout(fail, 15000);
    script.onload = () => {
      clearTimeout(timer);
      if (identity()?.accounts.oauth2) resolve();
      else fail();
    };
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return loading;
};

// Call synchronously from the click handler so popup blockers allow the chooser.
export const requestGoogleToken = (clientId: string): Promise<GoogleToken> =>
  new Promise((resolve, reject) => {
    const google = identity();
    if (!google) {
      reject(new Error('Đăng nhập Google chưa sẵn sàng.'));
      return;
    }
    let settled = false;
    const finish = (result: GoogleToken | Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (result instanceof Error) reject(result);
      else resolve(result);
    };
    const timer = setTimeout(
      () => finish(new Error('Đăng nhập quá thời gian chờ. Hãy thử lại.')),
      120000,
    );
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: `openid email profile ${DRIVE_SCOPE}`,
        include_granted_scopes: false,
        callback: (response) => {
          if (response.error || !response.access_token) {
            finish(new Error('Bạn chưa hoàn tất cấp quyền Google.'));
            return;
          }
          if (!response.scope?.split(' ').includes(DRIVE_SCOPE)) {
            finish(
              new Error(
                'Cần cấp quyền lưu dữ liệu ứng dụng trên Drive để sao lưu.',
              ),
            );
            return;
          }
          const seconds = Number(response.expires_in);
          if (!Number.isFinite(seconds) || seconds <= 0) {
            finish(new Error('Phiên Google không hợp lệ.'));
            return;
          }
          finish({
            accessToken: response.access_token,
            expiresAt: Date.now() + seconds * 1000,
          });
        },
        error_callback: (error) =>
          finish(
            new Error(
              error.type === 'popup_closed'
                ? 'Đã đóng cửa sổ đăng nhập.'
                : 'Không mở được đăng nhập Google. Cho phép cửa sổ bật lên rồi thử lại.',
            ),
          ),
      });
      client.requestAccessToken({ prompt: 'select_account' });
    } catch {
      finish(new Error('Không khởi tạo được đăng nhập Google.'));
    }
  });
