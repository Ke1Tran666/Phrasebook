import { useEffect, useId, useRef, useState } from 'react';
import { ExternalLink, Square, Volume2 } from 'lucide-react';
import { useLanguage } from '@/language';

type Props = { text: string };

const ListenButton = ({ text }: Props) => {
  const { t } = useLanguage();
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
      setError(t('listen.unsupported'));
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
        setError(t('listen.failed'));
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
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-forest hover:bg-surface-soft"
        >
          {playing ? <Square size={17} /> : <Volume2 size={17} />}
          {playing ? t('listen.stop') : t('listen.play')}
        </button>
        <select
          aria-label={t('listen.voice')}
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          <option value="en-US">{t('listen.us')}</option>
          <option value="en-GB">{t('listen.uk')}</option>
        </select>
        <select
          aria-label={t('listen.speed')}
          value={rate}
          onChange={(event) => setRate(event.target.value)}
        >
          <option value="0.75">{t('listen.slow')} · 0.75×</option>
          <option value="1">{t('listen.normal')} · 1×</option>
          <option value="1.25">{t('listen.fast')} · 1.25×</option>
        </select>
        <a
          href={googleTranslateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-forest transition-colors hover:bg-surface-soft"
        >
          <ExternalLink size={17} aria-hidden="true" />
          {t('listen.openTranslate')}
        </a>
      </div>
      <p id={descriptionId} className="mt-2 text-xs leading-relaxed text-muted">
        {t('listen.description')}
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
