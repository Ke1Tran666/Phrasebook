import { Check, ChevronDown, Moon, Palette, Star, Sun } from 'lucide-react';
import { useRef, useState } from 'react';
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
    swatch: 'bg-[#8b2bd1]',
    labelKey: 'theme.light',
    descriptionKey: 'theme.lightDescription',
  },
  {
    id: 'dark',
    icon: Moon,
    swatch: 'bg-[#211826]',
    labelKey: 'theme.dark',
    descriptionKey: 'theme.darkDescription',
  },
  {
    id: 'independence',
    icon: Star,
    swatch: 'bg-[#da251d]',
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

  const chooseTheme = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    themeMenu.current?.removeAttribute('open');
  };

  const chooseLanguage = (nextLanguage: AppLanguage) => {
    setLanguage(nextLanguage);
    languageMenu.current?.removeAttribute('open');
  };

  return (
    <div className="flex items-center gap-2.5 max-[760px]:gap-2">
      <details ref={languageMenu} className="group relative">
        <summary
          aria-label={t('language.title')}
          className="language-control flex h-10 min-w-29 cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-surface-soft px-3.5 text-sm font-semibold text-forest shadow-[0_3px_10px_#53206c12] transition-colors marker:content-none hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest max-[760px]:h-9 max-[760px]:min-w-24 max-[760px]:px-3 [&::-webkit-details-marker]:hidden"
        >
          <span aria-hidden="true" className="text-base leading-none">
            {currentLanguage.flag}
          </span>
          <span>{currentLanguage.code}</span>
          <ChevronDown aria-hidden="true" className="ml-auto" size={16} />
        </summary>

        <div className="absolute top-[calc(100%+10px)] right-0 z-20 w-60 rounded-xl border border-line bg-surface p-3 text-text shadow-[0_16px_45px_#3213401f]">
          <p className="px-2 pb-2 text-xs font-bold tracking-[0.12em] text-muted uppercase">
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
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-soft ${selected ? 'bg-surface-soft' : 'bg-transparent'}`}
                  onClick={() => chooseLanguage(option.id)}
                >
                  <span className="text-xl leading-none" aria-hidden="true">
                    {option.flag}
                  </span>
                  <strong className="min-w-0 flex-1 text-sm">
                    {t(option.labelKey)}
                  </strong>
                  {selected && <Check className="text-forest" size={17} />}
                </button>
              );
            })}
          </div>
        </div>
      </details>

      <details ref={themeMenu} className="group relative">
        <summary
          aria-label={t('theme.open')}
          className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-line bg-surface text-forest shadow-[0_3px_10px_#53206c12] transition-colors marker:content-none hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest max-[760px]:size-9 [&::-webkit-details-marker]:hidden"
          title={t('theme.open')}
        >
          <Palette size={21} strokeWidth={2} />
        </summary>

        <div className="theme-menu absolute top-[calc(100%+10px)] right-0 z-20 w-64 rounded-xl border border-line bg-surface p-3 text-text shadow-[0_16px_45px_#3213401f]">
          <p className="px-2 pb-2 text-xs font-bold tracking-[0.12em] text-muted uppercase">
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
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-soft ${selected ? 'bg-surface-soft' : 'bg-transparent'}`}
                  onClick={() => chooseTheme(option.id)}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full text-white shadow-[inset_0_0_0_3px_#ffffff38] ${option.swatch}`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm">
                      {t(option.labelKey)}
                    </strong>
                    <small className="mt-0.5 block text-xs text-muted">
                      {t(option.descriptionKey)}
                    </small>
                  </span>
                  {selected && <Check className="text-forest" size={17} />}
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
