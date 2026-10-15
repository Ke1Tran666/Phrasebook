import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { applyTheme, getStoredTheme } from '@/theme';
import { getStoredLanguage, LanguageProvider } from '@/language';
import '@fontsource-variable/dm-sans';
import '@/styles.css';

applyTheme(getStoredTheme());
document.documentElement.lang = getStoredLanguage();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
);
