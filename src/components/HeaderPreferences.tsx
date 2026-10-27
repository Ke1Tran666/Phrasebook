import { Check, ChevronDown, Moon, Palette, Star, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { applyTheme, getStoredTheme, type AppTheme } from '@/theme';
import { useLanguage, type AppLanguage, type MessageKey } from '@/language';

const themes: Array<{
  id: AppTheme;
  icon: typeof Sun;
  swatch: string;
  labelKey: MessageKey;
  descriptionKey: MessageKey;
}> = [
  {
    id: 'light',
    icon: Sun,
    swatch: 'bg-[#7e22ce]',
    labelKey: 'theme.light',
    descriptionKey: 'theme.lightDescription',
  },
  {
    id: 'dark',
    icon: Moon,
    swatch: 'bg-[#a855f7]',
    labelKey: 'theme.dark',
    descriptionKey: 'theme.darkDescription',
  },
  {
    id: 'independence',
    icon: Star,
    swatch: 'bg-[#d3231a]',
    labelKey: 'theme.independence',
    descriptionKey: 'theme.independenceDescription',
  },
];

const languages: Array<{
  id: AppLanguage;
  code: string;
  flag: string;
  labelKey: MessageKey;
}> = [
  { id: 'vi', code: 'VI', flag: '🇻🇳', labelKey: 'language.vi' },
  { id: 'en', code: 'EN', flag: '🇬🇧', labelKey: 'language.en' },
];

const HeaderPreferences = () => {
  const [theme, setTheme] = useState<AppTheme>(getStoredTheme);
  const themeMenu = useRef<HTMLDetailsElement>(null);
  const languageMenu = useRef<HTMLDetailsElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const currentLanguage = languages.find((option) => option.id === language)!;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (themeMenu.current?.open && !themeMenu.current.contains(target)) {
        themeMenu.current.removeAttribute('open');
      }
      if (
        languageMenu.current?.open &&
        !languageMenu.current.contains(target)
      ) {
        languageMenu.current.removeAttribute('open');
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () =>
      document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const chooseTheme = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    themeMenu.current?.removeAttribute('open');
  };

  const chooseLanguage = (nextLanguage: AppLanguage) => {
    setLanguage(nextLanguage);
    languageMenu.current?.removeAttribute('open');
  };

  const onToggleDetails = (which: 'theme' | 'lang') => {
    if (which === 'theme') {
      if (!themeMenu.current?.open) {
        languageMenu.current?.removeAttribute('open');
      }
    } else {
      if (!languageMenu.current?.open) {
        themeMenu.current?.removeAttribute('open');
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <details
        ref={languageMenu}
        className="group relative"
        onToggle={() => onToggleDetails('lang')}
      >
        <summary
          aria-label={t('language.title')}
          className="language-control flex h-9.5 min-w-26 cursor-pointer list-none items-center gap-2 rounded-xl border border-line bg-surface px-3 text-xs sm:text-sm font-semibold text-text shadow-xs transition-all hover:bg-surface-soft hover:border-line-hover focus-visible:outline-2 focus-visible:outline-forest max-[760px]:h-8.5 max-[760px]:min-w-22 max-[760px]:px-2.5 [&::-webkit-details-marker]:hidden"
        >
          <span aria-hidden="true" className="text-base leading-none">
            {currentLanguage.flag}
          </span>
          <span>{currentLanguage.code}</span>
          <ChevronDown
            aria-hidden="true"
            className="ml-auto text-muted transition-transform duration-200 group-open:rotate-180"
            size={14}
          />
        </summary>

        <div className="absolute top-[calc(100%+8px)] right-0 z-50 w-56 rounded-2xl border border-line bg-surface-elevated p-2 text-text shadow-dropdown backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-150">
          <p className="px-2.5 py-1.5 text-[11px] font-bold tracking-wider text-muted uppercase">
            {t('language.title')}
          </p>
          <div className="grid gap-1">
            {languages.map((option) => {
              const selected = option.id === language;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors ${
                    selected
                      ? 'bg-surface-soft font-semibold text-forest'
                      : 'text-text hover:bg-surface-soft'
                  }`}
                  onClick={() => chooseLanguage(option.id)}
                >
                  <span className="text-lg leading-none" aria-hidden="true">
                    {option.flag}
                  </span>
                  <strong className="min-w-0 flex-1 font-medium">
                    {t(option.labelKey)}
                  </strong>
                  {selected && <Check className="text-forest" size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      </details>

      <details
        ref={themeMenu}
        className="group relative"
        onToggle={() => onToggleDetails('theme')}
      >
        <summary
          aria-label={t('theme.open')}
          className="grid size-9.5 cursor-pointer list-none place-items-center rounded-xl border border-line bg-surface text-forest shadow-xs transition-all hover:bg-surface-soft hover:border-line-hover focus-visible:outline-2 focus-visible:outline-forest max-[760px]:size-8.5 [&::-webkit-details-marker]:hidden"
          title={t('theme.open')}
        >
          <Palette size={18} strokeWidth={2.2} />
        </summary>

        <div className="theme-menu absolute top-[calc(100%+8px)] right-0 z-50 w-64 rounded-2xl border border-line bg-surface-elevated p-2 text-text shadow-dropdown backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-150">
          <p className="px-2.5 py-1.5 text-[11px] font-bold tracking-wider text-muted uppercase">
            {t('theme.title')}
          </p>
          <div className="grid gap-1">
            {themes.map((option) => {
              const Icon = option.icon;
              const selected = option.id === theme;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${
                    selected
                      ? 'bg-surface-soft font-semibold text-forest'
                      : 'text-text hover:bg-surface-soft'
                  }`}
                  onClick={() => chooseTheme(option.id)}
                >
                  <span
                    className={`grid size-7.5 shrink-0 place-items-center rounded-lg text-white shadow-xs ${option.swatch}`}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm font-medium">
                      {t(option.labelKey)}
                    </strong>
                    <small className="block text-xs text-muted leading-tight">
                      {t(option.descriptionKey)}
                    </small>
                  </span>
                  {selected && <Check className="text-forest" size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      </details>
    </div>
  );
};

export default HeaderPreferences;
