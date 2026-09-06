import { next } from '@vercel/edge';

/**
 * Lösenordsskydd som körs på Vercels edge, före att något innehåll levereras.
 * Utan giltig kaka får besökaren bara inloggningssidan – appens HTML, JS och
 * data lämnar aldrig servern. Lösenordet sätts med miljövariabeln APP_PASSWORD
 * i Vercel (Settings → Environment Variables) och når aldrig webbläsaren.
 */

const COOKIE = 'familjen_auth';
const YEAR = 60 * 60 * 24 * 365;

/** Öppet utan lösenord: ikon, manifest och avatarerna som inloggningssidan visar. */
const OPEN = [/^\/icon\.svg$/, /^\/manifest\.webmanifest$/, /^\/avatars\//, /^\/favicon\.ico$/];

const password = () => (process.env.APP_PASSWORD || 'mkasb').trim();
const secret = () => process.env.AUTH_SECRET || 'familjetavlan-ingen-egen-nyckel';

async function expectedToken() {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`familjen:${password()}`));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readCookie(req: Request, name: string) {
  for (const part of (req.headers.get('cookie') ?? '').split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default async function middleware(req: Request) {
  const url = new URL(req.url);
  if (OPEN.some((re) => re.test(url.pathname))) return next();

  const token = await expectedToken();
  const cookie = readCookie(req, COOKIE);
  if (cookie && equal(cookie, token)) return next();

  if (req.method === 'POST' && url.pathname === '/login') {
    const form = await req.formData();
    const given = String(form.get('password') ?? '').trim().toLowerCase();
    if (equal(given, password().toLowerCase())) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/',
          'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${YEAR}`,
        },
      });
    }
    return loginPage(true);
  }

  return loginPage(false);
}

const AVATARS = ['martin', 'karin', 'astrid', 'signe', 'bodil'];
const RINGS: Record<string, string> = { martin: '#bfdbfe', karin: '#c7d7fe', astrid: '#fecdd3', signe: '#fde68a', bodil: '#fecaca' };

function loginPage(wrong: boolean) {
  const html = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#1e3a8a">
<title>Familjeliv</title>
<link rel="icon" href="/icon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
  body {
    margin: 0; min-height: 100dvh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 0 26px; gap: 0;
    font-family: 'Baloo 2', system-ui, -apple-system, sans-serif; color: #fff;
    background: linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 55%, #9f1239 100%);
    -webkit-font-smoothing: antialiased;
  }
  .faces { display: flex; gap: 6px; margin-bottom: 22px; }
  .face { width: 42px; height: 42px; border-radius: 999px; overflow: hidden; background: #fff; box-shadow: 0 3px 0 0 rgba(0,0,0,.18); }
  .face img { width: 100%; height: 100%; display: block; }
  h1 { font-size: 30px; font-weight: 900; letter-spacing: -.02em; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,.3); }
  p.sub { font-size: 14.5px; font-weight: 700; opacity: .85; margin: 2px 0 20px; text-align: center; }
  form { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 10px; }
  input {
    width: 100%; font-family: inherit; font-size: 17px; font-weight: 700; text-align: center;
    color: #111827; background: #fff; border-radius: 20px; padding: 13px 16px 14px;
    border: 3px solid ${wrong ? '#fecdd3' : 'rgba(255,255,255,.55)'}; outline: none;
    box-shadow: inset 0 2px 4px 0 rgba(17,24,39,.08);
  }
  button {
    width: 100%; font-family: inherit; font-size: 17px; font-weight: 900; color: #fff;
    border: 3px solid rgba(255,255,255,.55); background: rgba(255,255,255,.18);
    backdrop-filter: blur(6px); border-radius: 20px; padding: 12px 0 13px; cursor: pointer;
    box-shadow: 0 4px 0 0 rgba(0,0,0,.2), inset 0 2px 4px 0 rgba(255,255,255,.3);
    transition: transform .08s ease, box-shadow .08s ease;
  }
  button:active { transform: translateY(2px); box-shadow: 0 1px 0 0 rgba(0,0,0,.2); }
  .err { height: 22px; margin-top: 10px; font-size: 14px; font-weight: 800; color: #fecdd3; }
</style>
</head>
<body>
  <div class="faces">
    ${AVATARS.map((a) => `<div class="face" style="border:3px solid ${RINGS[a]}"><img src="/avatars/${a}.svg" alt=""></div>`).join('')}
  </div>
  <h1>Familjeliv</h1>
  <p class="sub">Skriv familjens lösenord för att komma in.</p>
  <form method="POST" action="/login">
    <input type="password" name="password" placeholder="Lösenord" autofocus autocomplete="current-password">
    <button type="submit">Lås upp</button>
  </form>
  <div class="err">${wrong ? 'Fel lösenord – försök igen' : ''}</div>
</body>
</html>`;

  return new Response(html, {
    status: 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
