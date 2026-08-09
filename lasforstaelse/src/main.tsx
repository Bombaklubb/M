import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DarkModeProvider } from './contexts/DarkModeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
);

/*
 * Service worker för skolans nät: appen och det två megabyte stora
 * textbiblioteket behöver inte hämtas på nytt varje lektion. Se public/sw.js
 * för strategierna.
 *
 * Registreras bara i den byggda versionen. Under utveckling skulle en cache
 * göra att ändringar inte syns, vilket kostar mer tid än den sparar.
 */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      // Misslyckad registrering får aldrig hindra appen från att starta.
      console.debug('Service worker kunde inte registreras:', error);
    });
  });
}
