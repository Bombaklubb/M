import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global fallback – catches errors that happen outside the React tree
// (module init, async code, etc.) so the page never stays blank.
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  const root = document.getElementById('root');
  if (root && !root.hasChildNodes()) {
    root.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui;padding:2rem">
        <div style="max-width:360px;text-align:center">
          <div style="font-size:3rem;margin-bottom:1rem">😵</div>
          <h1 style="font-size:1.4rem;font-weight:900;margin-bottom:.5rem">Oj! Något gick fel</h1>
          <p style="color:#666;font-size:.9rem;margin-bottom:1.5rem">Appen kunde inte starta. Tryck på knappen för att rensa data och ladda om.</p>
          <button onclick="for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k&&(k.startsWith('math_')||k.startsWith('drill_pb_')||k==='theme-size'))localStorage.removeItem(k)};location.reload()"
            style="background:#3b82f6;color:#fff;border:none;padding:.75rem 2rem;border-radius:1rem;font-weight:700;font-size:1rem;cursor:pointer">
            Rensa data och ladda om
          </button>
        </div>
      </div>`;
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
