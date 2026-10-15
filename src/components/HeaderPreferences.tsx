import { Check, ChevronDown, Moon, Palette, Star, Sun } from 'lucide-react';
import { useRef, useState } from 'react';
import { applyTheme, getStoredTheme, type AppTheme } from '@/theme';

const themes: Array<{
  id: AppTheme;
  label: string;
  description: string;
  icon: typeof Sun;
  swatch: string;
}> = [
  {
    id: 'light',
    label: 'Sáng',
    description: 'Tím SimEnglish',
    icon: Sun,
    swatch: 'bg-[#8b2bd1]',
  },
  {
    id: 'dark',
    label: 'Tối',
    description: 'Tím than dịu mắt',
    icon: Moon,
    swatch: 'bg-[#211826]',
  },
  {
    id: 'independence',
    label: 'Lễ Độc lập',
    description: 'Đỏ sao vàng',
    icon: Star,
    swatch: 'bg-[#da251d]',
  },
];

const HeaderPreferences = () => {
  const [theme, setTheme] = useState<AppTheme>(getStoredTheme);
  const themeMenu = useRef<HTMLDetailsElement>(null);

  const chooseTheme = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    themeMenu.current?.removeAttribute('open');
  };

  return (
    <div className="flex items-center gap-2.5 max-[760px]:gap-2">
      <label className="language-control relative flex h-10 min-w-[116px] cursor-pointer items-center gap-2 rounded-full border border-line bg-[var(--color-surface-soft)] px-3.5 text-sm font-semibold text-forest shadow-[0_3px_10px_#53206c12] transition-colors hover:brightness-95 focus-within:ring-2 focus-within:ring-[#8b2bd133] max-[760px]:h-9 max-[760px]:min-w-[96px] max-[760px]:px-3">
        <span aria-hidden="true" className="text-base leading-none">
          🇬🇧
        </span>
        <span>EN</span>
        <ChevronDown aria-hidden="true" className="ml-auto" size={16} />
        <select
          aria-label="Ngôn ngữ học"
          className="absolute inset-0 cursor-pointer appearance-none opacity-0"
          defaultValue="en"
        >
          <option value="en">EN</option>
        </select>
      </label>

      <details ref={themeMenu} className="group relative">
        <summary
          aria-label="Đổi giao diện"
          className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-line bg-[var(--color-surface)] text-forest shadow-[0_3px_10px_#53206c12] transition-colors marker:content-none hover:bg-[var(--color-surface-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest max-[760px]:size-9 [&::-webkit-details-marker]:hidden"
          title="Đổi giao diện"
        >
          <Palette size={21} strokeWidth={2} />
        </summary>

        <div className="theme-menu absolute top-[calc(100%+10px)] right-0 z-20 w-64 rounded-xl border border-line bg-[var(--color-surface)] p-3 text-[var(--color-text)] shadow-[0_16px_45px_#3213401f]">
          <p className="px-2 pb-2 text-xs font-bold tracking-[0.12em] text-muted uppercase">
            Chọn giao diện
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
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-soft)] ${selected ? 'bg-[var(--color-surface-soft)]' : 'bg-transparent'}`}
                  onClick={() => chooseTheme(option.id)}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full text-white shadow-[inset_0_0_0_3px_#ffffff38] ${option.swatch}`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm">{option.label}</strong>
                    <small className="mt-0.5 block text-xs text-muted">
                      {option.description}
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
