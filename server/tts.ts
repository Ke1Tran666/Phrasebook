import { createServer, type IncomingMessage } from 'node:http';
import { GoogleAuth, OAuth2Client, type TokenInfo } from 'google-auth-library';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const validateSpeech = (input: unknown) => {
  const value = input as Record<string, unknown> | null;
  if (!value || typeof value.text !== 'string' || !value.text.trim())
    throw new HttpError(400, 'Chưa có nội dung để đọc.');
  const text = value.text.trim();
  if (Buffer.byteLength(text, 'utf8') > 5000)
    throw new HttpError(
      400,
      'Nội dung quá dài. Mỗi lần nghe tối đa 5.000 byte văn bản.',
    );
  if (value.voice !== 'en-US' && value.voice !== 'en-GB')
    throw new HttpError(400, 'Giọng đọc không hợp lệ.');
  if (![0.75, 1, 1.25].includes(Number(value.rate)))
    throw new HttpError(400, 'Tốc độ không hợp lệ.');
  return { text, voice: value.voice, rate: Number(value.rate) };
};
export const authorize = (
  info: TokenInfo,
  clientId: string,
  emails: Set<string>,
) => {
  if (
    info.aud !== clientId ||
    info.expiry_date <= Date.now() ||
    !info.email ||
    String(info.email_verified) !== 'true'
  )
    throw new HttpError(
      401,
      'Phiên Google không hợp lệ. Hãy kết nối lại trong mục Sao lưu.',
    );
  if (!emails.has(info.email.toLowerCase()))
    throw new HttpError(
      403,
      'Tài khoản chưa được cấp quyền nghe. Hãy thêm email vào cấu hình backend.',
    );
  return info.email.toLowerCase();
};
const readBody = async (req: IncomingMessage) => {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 32768) throw new HttpError(413, 'Yêu cầu quá lớn.');
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'Nội dung yêu cầu không hợp lệ.');
  }
};

type Options = {
  clientId: string;
  emails: Set<string>;
  verify: (token: string) => Promise<TokenInfo>;
  synthesize: (input: ReturnType<typeof validateSpeech>) => Promise<Buffer>;
};
export const createSpeechServer = ({
  clientId,
  emails,
  verify,
  synthesize,
}: Options) => {
  const limits = new Map<string, { start: number; count: number }>();
  let active = 0;
  let total = 0;
  let windowStart = Date.now();
  return createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    try {
      if (req.url !== '/api/tts')
        throw new HttpError(404, 'Không tìm thấy dịch vụ.');
      if (req.method !== 'POST') throw new HttpError(405, 'Chỉ hỗ trợ POST.');
      if (!clientId || !emails.size)
        throw new HttpError(503, 'Chưa cấu hình dịch vụ nghe trên backend.');
      if (!req.headers['content-type']?.startsWith('application/json'))
        throw new HttpError(415, 'Yêu cầu phải là JSON.');
      const match = /^Bearer ([^\s]{1,4096})$/.exec(
        req.headers.authorization || '',
      );
      if (!match)
        throw new HttpError(
          401,
          'Hãy kết nối Google trong mục Sao lưu để nghe.',
        );
      if (active >= 3)
        throw new HttpError(429, 'Dịch vụ đang bận. Hãy thử lại sau.');
      active++;
      try {
        let info: TokenInfo;
        try {
          info = await verify(match[1]);
        } catch {
          throw new HttpError(
            401,
            'Phiên Google hết hạn hoặc không xác minh được. Hãy kết nối lại.',
          );
        }
        const email = authorize(info, clientId, emails);
        const input = validateSpeech(await readBody(req));
        const now = Date.now();
        if (now - windowStart >= 3600000) {
          windowStart = now;
          total = 0;
        }
        const bucket = limits.get(email);
        const current =
          !bucket || now - bucket.start >= 60000
            ? { start: now, count: 0 }
            : bucket;
        if (current.count >= 10 || total >= 100)
          throw new HttpError(429, 'Đã đạt giới hạn nghe. Hãy thử lại sau.');
        current.count++;
        limits.set(email, current);
        total++;
        const audio = await synthesize(input);
        if (!audio.length)
          throw new HttpError(502, 'Google chưa trả về âm thanh.');
        res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
        res.end(audio);
      } finally {
        active--;
      }
    } catch (error) {
      const known = error instanceof HttpError;
      res.writeHead(known ? error.status : 502, {
        'Content-Type': 'application/json; charset=utf-8',
      });
      res.end(
        JSON.stringify({
          error: known
            ? error.message
            : 'Không tạo được giọng đọc. Kiểm tra cấu hình Google Cloud, quyền truy cập và hạn mức backend.',
        }),
      );
    }
  });
};

export const googleSpeech = () => {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const oauth = new OAuth2Client({
    transporterOptions: { timeout: 10000, retry: false },
  });
  return {
    verify: (token: string) => oauth.getTokenInfo(token),
    synthesize: async (input: ReturnType<typeof validateSpeech>) => {
      const client = await auth.getClient();
      const response = await client.request<{ audioContent: string }>({
        url: 'https://texttospeech.googleapis.com/v1/text:synthesize',
        method: 'POST',
        timeout: 30000,
        retry: false,
        data: {
          input: { text: input.text },
          voice: {
            languageCode: input.voice,
            name: `${input.voice}-Standard-A`,
          },
          audioConfig: { audioEncoding: 'MP3', speakingRate: input.rate },
        },
      });
      if (typeof response.data.audioContent !== 'string')
        throw new Error('Missing audio');
      return Buffer.from(response.data.audioContent, 'base64');
    },
  };
};
