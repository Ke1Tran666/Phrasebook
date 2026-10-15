import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { applyTheme, getStoredTheme } from '@/theme';
import '@fontsource-variable/dm-sans';
import '@/styles.css';

applyTheme(getStoredTheme());

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
