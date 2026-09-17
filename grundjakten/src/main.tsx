import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initSchema } from '@/lib/storage';

/**
 * Om något går sönder redan innan React hunnit montera fångar
 * ErrorBoundary det inte. Då injicerar vi en återställningsknapp direkt i
 * DOM:en – annars får eleven en vit skärm utan väg vidare.
 */
window.onerror = () => {
  const root = document.getElementById('root');
  if (root && root.childElementCount === 0) {
    root.innerHTML = `
      <div style="min-height:100dvh;display:grid;place-items:center;gap:24px;
                  font-family:system-ui;text-align:center;padding:24px">
        <div>
          <div style="font-size:72px">🔧</div>
          <p style="font-size:22px;font-weight:700">Något gick fel.</p>
          <button onclick="localStorage.clear();location.reload()"
                  style="font-size:22px;font-weight:800;padding:18px 36px;border:none;
                         border-radius:16px;background:#84cc16;color:#fff">
            Börja om
          </button>
        </div>
      </div>`;
  }
};

initSchema();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
