import { useEffect, useId, useRef, useState } from 'react';
import { ExternalLink, Square, Volume2 } from 'lucide-react';

type Props = { text: string };

const ListenButton = ({ text }: Props) => {
  const [language, setLanguage] = useState('en-US');
  const [rate, setRate] = useState('1');
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const descriptionId = useId();
  const googleTranslateUrl = `https://translate.google.com/?sl=en&tl=vi&text=${encodeURIComponent(text)}&op=translate`;

  const stop = () => {
    window.speechSynthesis?.cancel();
    utterance.current = null;
  };

  useEffect(() => {
    stop();
    setPlaying(false);
    setError('');
    return stop;
  }, [language, rate, text]);

  const play = () => {
    if (
      !('speechSynthesis' in window) ||
      !('SpeechSynthesisUtterance' in window)
    ) {
      setError(
        'Trình duyệt này chưa hỗ trợ đọc văn bản. Hãy thử Chrome hoặc Edge phiên bản mới.',
      );
      return;
    }

    if (playing) {
      stop();
      setPlaying(false);
      return;
    }

    stop();
    setError('');

    const speech = new SpeechSynthesisUtterance(text.trim());
    const normalizedLanguage = language.toLowerCase();
    speech.lang = language;
    speech.rate = Number(rate);
    speech.voice =
      window.speechSynthesis
        .getVoices()
        .find(
          (voice) =>
            voice.lang.replace('_', '-').toLowerCase() === normalizedLanguage,
        ) ?? null;
    speech.onstart = () => setPlaying(true);
    speech.onend = () => {
      if (utterance.current === speech) {
        utterance.current = null;
        setPlaying(false);
      }
    };
    speech.onerror = (event) => {
      if (utterance.current !== speech) return;
      utterance.current = null;
      setPlaying(false);
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        setError('Không phát được giọng đọc trên thiết bị này. Hãy thử lại.');
      }
    };

    utterance.current = speech;
    setPlaying(true);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="my-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={play}
          aria-describedby={descriptionId}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-forest hover:bg-[#f0f4f1]"
        >
          {playing ? <Square size={17} /> : <Volume2 size={17} />}
          {playing ? 'Dừng đọc' : 'Nghe phát âm'}
        </button>
        <select
          aria-label="Giọng đọc"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
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
        <a
          href={googleTranslateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-forest transition-colors hover:bg-[#f0f4f1]"
        >
          <ExternalLink size={17} aria-hidden="true" />
          Mở Google Translate
        </a>
      </div>
      <p id={descriptionId} className="mt-2 text-xs leading-relaxed text-muted">
        Giọng đọc do trình duyệt và thiết bị cung cấp. Khi mở Google Translate,
        nội dung tiếng Anh được đưa vào đường dẫn gửi đến Google.
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
