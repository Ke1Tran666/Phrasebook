import { useEffect, useRef, useState, useId } from 'react';
import { LoaderCircle, Square, Volume2 } from 'lucide-react';

type Props = { text: string; accessToken?: string };
const ListenButton = ({ text, accessToken }: Props) => {
  const [voice, setVoice] = useState('en-US');
  const [rate, setRate] = useState('1');
  const [state, setState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [error, setError] = useState('');
  const audio = useRef<HTMLAudioElement | null>(null);
  const url = useRef<string | null>(null);
  const request = useRef<AbortController | null>(null);
  const id = useId();
  const stop = () => {
    request.current?.abort();
    request.current = null;
    audio.current?.pause();
    audio.current = null;
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = null;
  };
  useEffect(() => {
    stop();
    setState('idle');
    setError('');
    return stop;
  }, [text, accessToken, voice, rate]);
  const play = async () => {
    if (state !== 'idle') {
      stop();
      setState('idle');
      return;
    }
    if (!accessToken) {
      setError(
        'Kết nối Google trong mục Sao lưu dữ liệu để sử dụng giọng đọc.',
      );
      return;
    }
    stop();
    setError('');
    setState('loading');
    const controller = new AbortController();
    request.current = controller;
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text, voice, rate: Number(rate) }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error ||
            'Chưa kết nối được dịch vụ nghe. Hãy kiểm tra backend TTS.',
        );
      }
      if (!response.headers.get('content-type')?.includes('audio/mpeg'))
        throw new Error('Dịch vụ nghe chưa được cấu hình.');
      const blob = await response.blob();
      if (controller.signal.aborted) return;
      url.current = URL.createObjectURL(blob);
      const player = new Audio(url.current);
      audio.current = player;
      player.onended = () => {
        stop();
        setState('idle');
      };
      player.onerror = () => {
        stop();
        setState('idle');
        setError('Không phát được âm thanh. Hãy thử lại.');
      };
      await player.play();
      if (!controller.signal.aborted) setState('playing');
    } catch (e) {
      if (request.current === controller) {
        const timedOut = controller.signal.aborted;
        stop();
        setState('idle');
        setError(
          timedOut
            ? 'Đã hết thời gian chờ giọng đọc. Hãy thử lại.'
            : (e as Error).message,
        );
      }
    } finally {
      clearTimeout(timer);
    }
  };
  return (
    <div className="my-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void play()}
          aria-describedby={id}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-forest hover:bg-[#f0f4f1]"
        >
          {state === 'loading' ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : state === 'playing' ? (
            <Square size={17} />
          ) : (
            <Volume2 size={17} />
          )}
          {state === 'loading'
            ? 'Hủy tải'
            : state === 'playing'
              ? 'Dừng đọc'
              : 'Nghe phát âm'}
        </button>
        <select
          aria-label="Giọng đọc"
          value={voice}
          onChange={(event) => setVoice(event.target.value)}
        >
          <option value="en-US">Anh–Mỹ</option>
          <option value="en-GB">Anh–Anh</option>
        </select>
        <select
          aria-label="Tốc độ đọc"
          value={rate}
          onChange={(event) => setRate(event.target.value)}
        >
          <option value="0.75">Chậm · 0.75×</option>
          <option value="1">Bình thường · 1×</option>
          <option value="1.25">Nhanh · 1.25×</option>
        </select>
      </div>
      <p id={id} className="mt-2 text-xs leading-relaxed text-muted">
        Khi bấm nghe, nội dung tiếng Anh được gửi đến Google Cloud để tạo giọng
        đọc.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
};
export default ListenButton;
