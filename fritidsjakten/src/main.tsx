import React from 'react'
import ReactDOM from 'react-dom/client'
// Nunito självhostas (inga anrop till Google Fonts) – appen skickar därmed
// inga besökaruppgifter vidare och fungerar även utan internet.
import '@fontsource-variable/nunito/wght.css'
import App from './App'
import './index.css'

// Global fallback – fångar fel utanför React-trädet (modulinit, asynkron kod)
// så att sidan aldrig blir helt vit.
window.addEventListener('error', (e) => {
  console.error('Globalt fel:', e.error)
  const root = document.getElementById('root')
  if (root && !root.hasChildNodes()) {
    // Knappens händelse kopplas i JS (inte inline onclick) så att sidan
    // fungerar även under en strikt Content-Security-Policy.
    root.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui;padding:2rem">
        <div style="max-width:360px;text-align:center">
          <div style="font-size:3rem;margin-bottom:1rem">😵</div>
          <h1 style="font-size:1.4rem;font-weight:900;margin-bottom:.5rem">Oj! Något gick fel</h1>
          <p style="color:#666;font-size:.9rem;margin-bottom:1.5rem">Appen kunde inte starta. Tryck på knappen för att rensa sparade data och ladda om.</p>
          <button id="fritids-rensa"
            style="background:#0ea5e9;color:#fff;border:none;padding:.75rem 2rem;border-radius:1rem;font-weight:700;font-size:1rem;cursor:pointer">
            Rensa data och ladda om
          </button>
        </div>
      </div>`
    root.querySelector('#fritids-rensa')?.addEventListener('click', () => {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i)
        if (k && k.startsWith('fritids_')) localStorage.removeItem(k)
      }
      location.reload()
    })
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
