import { useEffect, useId, useRef, useState } from 'react';
import { ExternalLink, Square, Volume2 } from 'lucide-react';
import { useLanguage } from '@/language';
import FilterSelect from '@/components/FilterSelect';

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
      <div className="relative flex flex-nowrap items-center gap-2">
        <button
          type="button"
          onClick={play}
          aria-describedby={descriptionId}
          className="inline-flex shrink-0 min-h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-xs sm:text-sm font-medium text-forest transition-colors hover:bg-surface-soft"
        >
          {playing ? <Square size={16} /> : <Volume2 size={16} />}
          <span>{playing ? t('listen.stop') : t('listen.play')}</span>
        </button>

        <div className="w-31.25 shrink-0">
          <FilterSelect
            label={t('listen.voice')}
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'en-US', label: t('listen.us') },
              { value: 'en-GB', label: t('listen.uk') },
            ]}
          />
        </div>

        <div className="w-36.25 shrink-0">
          <FilterSelect
            label={t('listen.speed')}
            value={rate}
            onChange={setRate}
            options={[
              { value: '0.75', label: `${t('listen.slow')} · 0.75×` },
              { value: '1', label: `${t('listen.normal')} · 1×` },
              { value: '1.25', label: `${t('listen.fast')} · 1.25×` },
            ]}
          />
        </div>

        {/* Nút Mở Google Translate */}
        <a
          href={googleTranslateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 min-h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-xs sm:text-sm font-medium text-forest transition-colors hover:bg-surface-soft"
        >
          <ExternalLink size={15} aria-hidden="true" />
          <span>{t('listen.openTranslate')}</span>
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
