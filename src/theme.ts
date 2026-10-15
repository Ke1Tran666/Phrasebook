export type AppTheme = 'light' | 'dark' | 'independence';

export const THEME_STORAGE_KEY = 'phrasebook-theme';

export const isAppTheme = (value: string | null): value is AppTheme =>
  value === 'light' || value === 'dark' || value === 'independence';

export const getStoredTheme = (): AppTheme => {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isAppTheme(stored) ? stored : 'light';
};

export const applyTheme = (theme: AppTheme) => {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};
