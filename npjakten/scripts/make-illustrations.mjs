// Genererar illustrationer (SVG) till alla läsprov och skrivuppgifter.
// Enhetlig, mjuk "flat illustration"-stil: pastellhimmel, rundade kullar
// och 1–2 tydliga motiv per bild. 800x450 (16:9).
import fs from "fs";

const W = 800, H = 450;
const out = "./public/images";
fs.mkdirSync(out, { recursive: true });

const svg = (body, bg = "#dceefb") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">` +
  `<rect width="${W}" height="${H}" fill="${bg}"/>` + body + `</svg>`;

// Återkommande byggstenar
const sun = (x, y, r = 38, c = "#ffd66b") =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r + 14}" fill="${c}" opacity=".25"/>`;
const cloud = (x, y, s = 1, c = "#ffffff", o = .9) =>
  `<g transform="translate(${x},${y}) scale(${s})" fill="${c}" opacity="${o}"><ellipse cx="0" cy="0" rx="46" ry="20"/><ellipse cx="-30" cy="8" rx="30" ry="14"/><ellipse cx="32" cy="8" rx="34" ry="15"/></g>`;
const hill = (cy, ry, c) => `<ellipse cx="${W / 2}" cy="${cy}" rx="${W * .75}" ry="${ry}" fill="${c}"/>`;
const gran = (x, y, s = 1, c = "#3e7d5a") =>
  `<g transform="translate(${x},${y}) scale(${s})"><polygon points="0,-70 26,-18 -26,-18" fill="${c}"/><polygon points="0,-44 32,14 -32,14" fill="${c}"/><rect x="-5" y="14" width="10" height="16" fill="#7a5536"/></g>`;
const star = (x, y, r = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff7cf"/>`;
const person = (x, y, s, shirt, skin = "#f3c39e", hair = "#5b3a23") =>
  `<g transform="translate(${x},${y}) scale(${s})">` +
  `<circle cx="0" cy="-46" r="14" fill="${skin}"/><path d="M-14,-50 a14,14 0 0 1 28,0 l0,-6 a14,9 0 0 0 -28,0 z" fill="${hair}"/>` +
  `<rect x="-13" y="-32" width="26" height="34" rx="9" fill="${shirt}"/>` +
  `<rect x="-12" y="0" width="9" height="26" rx="4" fill="#41526b"/><rect x="3" y="0" width="9" height="26" rx="4" fill="#41526b"/></g>`;

const pics = {};

// ---------- ÅK 3 ----------
pics["hundvakten"] = svg(
  sun(690, 80) + cloud(160, 70, 1) + cloud(420, 110, .7) +
  hill(470, 150, "#a8d88f") + hill(520, 170, "#8fcb78") +
  // träd
  `<rect x="120" y="250" width="18" height="80" fill="#7a5536"/><circle cx="129" cy="225" r="55" fill="#5da06f"/><circle cx="95" cy="250" r="38" fill="#6cb27e"/><circle cx="165" cy="250" r="38" fill="#6cb27e"/>` +
  // pojke
  person(560, 350, 1.25, "#e8694a") +
  // koppel
  `<path d="M545,318 Q470,330 415,352" stroke="#c0392b" stroke-width="5" fill="none" stroke-linecap="round"/>` +
  // hund (lurvig brun)
  `<g transform="translate(360,360)"><ellipse cx="0" cy="0" rx="52" ry="30" fill="#9a6b3f"/><circle cx="48" cy="-18" r="22" fill="#9a6b3f"/><path d="M36,-34 q-4,-16 8,-22 q6,12 2,20 z" fill="#7a5230"/><path d="M62,-32 q10,-12 18,-8 q0,12 -10,16 z" fill="#7a5230"/><circle cx="56" cy="-20" r="3.5" fill="#2d2a26"/><circle cx="68" cy="-13" r="5" fill="#2d2a26"/><path d="M-48,-6 q-22,-6 -18,-26 q16,2 22,16 z" fill="#9a6b3f"/><rect x="-30" y="22" width="11" height="22" rx="5" fill="#83592f"/><rect x="14" y="22" width="11" height="22" rx="5" fill="#83592f"/></g>`,
  "#cfe9f7");

pics["igelkotten"] = svg(
  `<rect width="${W}" height="${H}" fill="#f7e2c4"/>` + sun(110, 90, 34, "#ffb45e") +
  hill(470, 160, "#d9b380") + hill(520, 170, "#c89e69") +
  // löv
  `<ellipse cx="640" cy="370" rx="26" ry="11" fill="#d97f43" transform="rotate(-15 640 370)"/><ellipse cx="700" cy="395" rx="22" ry="9" fill="#c96a35" transform="rotate(10 700 395)"/><ellipse cx="140" cy="400" rx="24" ry="10" fill="#d97f43" transform="rotate(8 140 400)"/>` +
  // igelkott
  `<g transform="translate(400,330)">` +
  Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (.12 + .76 * i / 12); const x = -Math.cos(a) * 95, y = -Math.sin(a) * 88; return `<polygon points="${x * .6},${y * .6} ${x * 1.28},${y * 1.28 + 4} ${x * .66 + 16},${y * .66}" fill="#6b4a2e"/>`; }).join("") +
  `<path d="M-95,10 a95,80 0 0 1 190,0 z" fill="#8a6038"/>` +
  `<path d="M70,10 q44,-26 58,-2 q4,8 -6,12 l-122,0 z" fill="#caa274"/><circle cx="122" cy="12" r="6" fill="#3a2d20"/><circle cx="92" cy="0" r="4" fill="#3a2d20"/></g>` +
  // äpple
  `<circle cx="560" cy="385" r="22" fill="#d8503f"/><rect x="557" y="356" width="5" height="12" rx="2" fill="#6b4a2e"/><ellipse cx="572" cy="360" rx="9" ry="5" fill="#5da06f" transform="rotate(-25 572 360)"/>`,
  "#f7e2c4");

pics["taltet"] = svg(
  `<rect width="${W}" height="${H}" fill="#1d2c4e"/>` +
  `<circle cx="660" cy="90" r="36" fill="#f4eecb"/><circle cx="646" cy="82" r="30" fill="#1d2c4e" opacity=".35"/>` +
  star(120, 60) + star(220, 110, 2.5) + star(330, 50) + star(450, 90) + star(540, 40, 2.5) + star(740, 180) + star(60, 160, 2.5) + star(390, 150, 2) +
  hill(480, 150, "#27406b") + hill(530, 170, "#1f3354") +
  // äppelträd siluett
  `<rect x="630" y="260" width="16" height="80" fill="#142038"/><circle cx="638" cy="240" r="48" fill="#172a47"/><circle cx="606" cy="262" r="32" fill="#172a47"/><circle cx="672" cy="262" r="32" fill="#172a47"/>` +
  // tält med varmt ljus
  `<g transform="translate(300,355)"><polygon points="-130,0 0,-120 130,0" fill="#2e7d54"/><polygon points="-130,0 0,-120 -34,0" fill="#256947"/><polygon points="0,-120 -38,0 38,0" fill="#ffd66b"/><polygon points="0,-120 -20,0 20,0" fill="#ffe9a8"/></g>` +
  `<ellipse cx="300" cy="362" rx="160" ry="12" fill="#16233e"/>`,
  "#1d2c4e");

pics["myror"] = svg(
  sun(100, 80) + cloud(600, 70, .9) +
  hill(480, 160, "#a8d88f") +
  // stack
  `<path d="M250,380 q150,-190 300,0 z" fill="#9a7146"/>` +
  Array.from({ length: 7 }, (_, i) => `<line x1="${300 + i * 30}" y1="${376 - Math.abs(3 - i) * -2}" x2="${330 + i * 28}" y2="${300 + Math.abs(3 - i) * 18}" stroke="#7d5836" stroke-width="3"/>`).join("") +
  `<ellipse cx="400" cy="382" rx="170" ry="10" fill="#88b873"/>` +
  // myror
  ["120,395", "600,400", "680,360"].map((p, i) => { const [x, y] = p.split(","); return `<g transform="translate(${x},${y}) scale(${1 - i * .15})"><ellipse cx="-16" cy="0" rx="12" ry="9" fill="#42302a"/><circle cx="0" cy="-2" r="7" fill="#42302a"/><ellipse cx="14" cy="0" rx="10" ry="8" fill="#42302a"/><line x1="-6" y1="4" x2="-14" y2="14" stroke="#42302a" stroke-width="2.5"/><line x1="0" y1="5" x2="2" y2="15" stroke="#42302a" stroke-width="2.5"/><line x1="8" y1="4" x2="16" y2="13" stroke="#42302a" stroke-width="2.5"/><line x1="2" y1="-8" x2="8" y2="-16" stroke="#42302a" stroke-width="2"/></g>`; }).join("") +
  // grässtrån
  `<path d="M70,400 q4,-26 -6,-38 M82,400 q2,-20 10,-30" stroke="#5da06f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M730,420 q4,-26 -6,-38 M742,420 q2,-20 10,-30" stroke="#5da06f" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  "#cfe9f7");

// ---------- ÅK 6 LÄSA ----------
pics["bageriet"] = svg(
  cloud(150, 80, 1) + cloud(620, 60, .8) + sun(710, 90, 30) +
  hill(490, 150, "#b9c9a8") +
  // smalt tvåvåningshus
  `<g transform="translate(400,355)">` +
  `<rect x="-110" y="-250" width="220" height="250" fill="#e8d9b8" stroke="#c9b890" stroke-width="3"/>` +
  `<polygon points="-126,-250 0,-310 126,-250" fill="#a8674f"/>` +
  // skylt
  `<rect x="-90" y="-236" width="180" height="34" rx="5" fill="#7e4a3a"/><rect x="-78" y="-228" width="156" height="18" rx="3" fill="#caa05a" opacity=".7"/>` +
  // förbommade fönster
  `<g fill="#bfae8c" stroke="#8d7c5d" stroke-width="3"><rect x="-82" y="-180" width="58" height="64"/><rect x="24" y="-180" width="58" height="64"/></g>` +
  `<line x1="-82" y1="-180" x2="-24" y2="-116" stroke="#8d7c5d" stroke-width="5"/><line x1="24" y1="-116" x2="82" y2="-180" stroke="#8d7c5d" stroke-width="5"/>` +
  // dörr + trappa
  `<rect x="-28" y="-78" width="56" height="78" rx="4" fill="#7e4a3a"/><circle cx="16" cy="-38" r="4" fill="#caa05a"/><rect x="-40" y="0" width="80" height="10" fill="#b3a07c"/>` +
  `</g>` +
  // kringel-symbol på skylten
  `<g transform="translate(400,136)" fill="none" stroke="#5e3326" stroke-width="6" stroke-linecap="round"><path d="M-22,8 a22,20 0 1 1 44,0 M-22,8 q10,14 22,2 M22,8 q-10,14 -22,2"/></g>`,
  "#cfe9f7");

pics["glasogon"] = svg(
  `<rect width="${W}" height="${H}" fill="#efe3c8"/>` +
  `<rect x="90" y="90" width="620" height="270" rx="10" fill="#f7eed8" stroke="#d8c7a0" stroke-width="3"/>` +
  // bok
  `<g transform="translate(400,250)"><path d="M-230,60 q115,-34 230,0 q115,-34 230,0 l0,-150 q-115,-34 -230,0 q-115,-34 -230,0 z" fill="#fdf6e3" stroke="#c9b890" stroke-width="4"/><line x1="0" y1="-66" x2="0" y2="58" stroke="#c9b890" stroke-width="4"/>` +
  Array.from({ length: 4 }, (_, i) => `<line x1="-196" y1="${-44 + i * 26}" x2="-36" y2="${-50 + i * 26}" stroke="#b9a986" stroke-width="5" stroke-linecap="round"/><line x1="36" y1="${-50 + i * 26}" x2="196" y2="${-44 + i * 26}" stroke="#b9a986" stroke-width="5" stroke-linecap="round"/>`).join("") + `</g>` +
  // runda glasögon
  `<g transform="translate(400,210)" stroke="#6b5436" stroke-width="8" fill="rgba(190,220,235,.5)"><circle cx="-62" cy="0" r="50"/><circle cx="62" cy="0" r="50"/><path d="M-12,0 q12,-16 24,0" fill="none"/></g>`,
  "#efe3c8");

pics["isen"] = svg(
  `<rect width="${W}" height="${H}" fill="#e7f1f8"/>` + sun(120, 80, 30, "#ffe9a8") +
  // skogslinje
  gran(620, 180, .9, "#7fa98e") + gran(680, 190, 1.1, "#6f9c80") + gran(740, 185, .85, "#7fa98e") + gran(60, 190, 1, "#7fa98e") + gran(130, 182, .8, "#8fb39c") +
  // is
  `<ellipse cx="400" cy="360" rx="380" ry="95" fill="#cfe6f3"/>` +
  // mörk is längre ut
  `<ellipse cx="540" cy="335" rx="150" ry="38" fill="#7da6c4"/><ellipse cx="540" cy="335" rx="100" ry="24" fill="#5f8cb0"/>` +
  // spricka
  `<path d="M470,340 l28,-8 l-10,12 l30,-4 l-12,10" stroke="#dceefb" stroke-width="3" fill="none"/>` +
  // vass
  `<g stroke="#c2a36b" stroke-width="5" stroke-linecap="round"><line x1="90" y1="400" x2="84" y2="330"/><line x1="112" y1="404" x2="112" y2="338"/><line x1="134" y1="400" x2="142" y2="336"/></g><ellipse cx="84" cy="324" rx="7" ry="16" fill="#8a6f48"/><ellipse cx="112" cy="332" rx="7" ry="16" fill="#8a6f48"/>` +
  // två skridskoåkare
  person(300, 350, 1.1, "#3f7fb5") + person(520, 318, .8, "#d35d4e") +
  `<line x1="278" y1="380" x2="322" y2="380" stroke="#8aa9be" stroke-width="3"/><line x1="505" y1="340" x2="537" y2="340" stroke="#8aa9be" stroke-width="3"/>`,
  "#e7f1f8");

pics["loven"] = svg(
  cloud(620, 80, .9) + hill(480, 150, "#d9c08a") +
  // träd: halva grönt, halva höstfärg
  `<rect x="382" y="220" width="36" height="140" rx="8" fill="#7a5536"/>` +
  `<path d="M392,236 q-14,-40 8,-66" stroke="#7a5536" stroke-width="12" fill="none"/>` +
  `<circle cx="330" cy="170" r="62" fill="#5da06f"/><circle cx="282" cy="216" r="44" fill="#6cb27e"/><circle cx="372" cy="120" r="48" fill="#5da06f"/>` +
  `<circle cx="470" cy="170" r="62" fill="#e0913f"/><circle cx="518" cy="216" r="44" fill="#d8743a"/><circle cx="438" cy="120" r="48" fill="#e7a84e"/>` +
  // fallande löv
  `<g fill="#d8743a"><ellipse cx="560" cy="270" rx="13" ry="6" transform="rotate(30 560 270)"/><ellipse cx="600" cy="330" rx="13" ry="6" transform="rotate(-20 600 330)"/><ellipse cx="540" cy="380" rx="13" ry="6" transform="rotate(15 540 380)"/></g>` +
  `<g fill="#e7a84e"><ellipse cx="640" cy="290" rx="12" ry="6" transform="rotate(-35 640 290)"/><ellipse cx="170" cy="396" rx="14" ry="6"/><ellipse cx="620" cy="400" rx="14" ry="6" transform="rotate(10 620 400)"/></g>`,
  "#dceefb");

pics["skolstart"] = svg(
  `<rect width="${W}" height="${H}" fill="#3a4a6b"/>` +
  // fönster med mörk morgon
  `<rect x="520" y="70" width="190" height="170" rx="8" fill="#1d2c4e" stroke="#26365a" stroke-width="10"/>` + star(570, 110) + star(660, 150, 2.5) + star(620, 100, 2) +
  `<line x1="615" y1="70" x2="615" y2="240" stroke="#26365a" stroke-width="8"/>` +
  // säng med sovande elev
  `<rect x="80" y="290" width="360" height="70" rx="14" fill="#5d6f93"/><rect x="80" y="300" width="360" height="26" rx="13" fill="#88a0c8"/>` +
  `<rect x="92" y="262" width="84" height="40" rx="12" fill="#e9eef7"/>` +
  `<circle cx="150" cy="268" r="24" fill="#f3c39e"/><path d="M126,266 a24,24 0 0 1 40,-16 q-22,-6 -34,10 z" fill="#5b3a23"/>` +
  `<path d="M170,300 q70,-26 250,-6 l0,40 q-160,-16 -250,6 z" fill="#c9556a"/>` +
  `<text x="240" y="220" font-family="Georgia,serif" font-size="40" fill="#aebde0" font-style="italic">z</text><text x="270" y="186" font-family="Georgia,serif" font-size="54" fill="#aebde0" font-style="italic">z</text><text x="310" y="146" font-family="Georgia,serif" font-size="68" fill="#aebde0" font-style="italic">Z</text>` +
  // väckarklocka
  `<g transform="translate(620,340)"><circle cx="0" cy="0" r="56" fill="#e8694a"/><circle cx="0" cy="0" r="44" fill="#fdf6e3"/><line x1="0" y1="0" x2="0" y2="-30" stroke="#3a3a3a" stroke-width="6" stroke-linecap="round"/><line x1="0" y1="0" x2="20" y2="12" stroke="#3a3a3a" stroke-width="6" stroke-linecap="round"/><circle cx="-38" cy="-44" r="11" fill="#e8694a"/><circle cx="38" cy="-44" r="11" fill="#e8694a"/><rect x="-8" y="52" width="6" height="14" fill="#b14e35" transform="rotate(20 -5 59)"/><rect x="2" y="52" width="6" height="14" fill="#b14e35" transform="rotate(-20 5 59)"/>` +
  `<path d="M-66,-58 q-12,-12 -8,-26 M66,-58 q12,-12 8,-26" stroke="#fdf6e3" stroke-width="5" fill="none" stroke-linecap="round"/></g>`,
  "#3a4a6b");

pics["insektshotell"] = svg(
  sun(100, 80) + cloud(650, 70, .9) + hill(490, 150, "#a8d88f") +
  // stolpe + låda
  `<rect x="390" y="240" width="20" height="140" fill="#7a5536"/>` +
  `<g transform="translate(400,170)"><rect x="-110" y="-80" width="220" height="150" rx="8" fill="#b3854f" stroke="#8a6038" stroke-width="5"/><polygon points="-124,-80 0,-128 124,-80" fill="#8a6038"/>` +
  `<line x1="0" y1="-80" x2="0" y2="70" stroke="#8a6038" stroke-width="5"/><line x1="-110" y1="-6" x2="110" y2="-6" stroke="#8a6038" stroke-width="5"/>` +
  // bambu-rör (cirklar)
  Array.from({ length: 8 }, (_, i) => `<circle cx="${-86 + (i % 4) * 24}" cy="${-52 + Math.floor(i / 4) * 26}" r="9" fill="#e8d9b8" stroke="#8a6038" stroke-width="3"/>`).join("") +
  Array.from({ length: 6 }, (_, i) => `<circle cx="${22 + (i % 3) * 30}" cy="${-50 + Math.floor(i / 3) * 28}" r="11" fill="#d9b380" stroke="#8a6038" stroke-width="3"/>`).join("") +
  // kottar och pinnar nedre halva
  `<circle cx="-80" cy="30" r="13" fill="#6b4a2e"/><circle cx="-48" cy="38" r="11" fill="#7d5836"/><circle cx="-16" cy="28" r="13" fill="#6b4a2e"/>` +
  `<g stroke="#7d5836" stroke-width="5" stroke-linecap="round"><line x1="20" y1="14" x2="96" y2="20"/><line x1="22" y1="34" x2="98" y2="40"/><line x1="20" y1="54" x2="96" y2="58"/></g></g>` +
  // bi
  `<g transform="translate(590,210)"><ellipse cx="0" cy="0" rx="20" ry="14" fill="#ffd66b"/><path d="M-8,-13 a14,14 0 0 1 0,27 M4,-14 a14,14 0 0 1 0,28" stroke="#3a3a3a" stroke-width="5" fill="none"/><ellipse cx="-4" cy="-18" rx="12" ry="7" fill="#cfe9f7" opacity=".85"/><circle cx="18" cy="-4" r="3" fill="#3a3a3a"/></g>` +
  `<path d="M610,230 q30,30 -10,60" stroke="#9db8cc" stroke-width="3" fill="none" stroke-dasharray="6 7"/>` +
  // blommor
  ["120,390", "190,410", "680,395"].map((p) => { const [x, y] = p.split(","); return `<g transform="translate(${x},${y})"><line x1="0" y1="0" x2="0" y2="-34" stroke="#5da06f" stroke-width="4"/><circle cx="0" cy="-44" r="7" fill="#ffd66b"/>` + Array.from({ length: 5 }, (_, i) => `<ellipse cx="${Math.cos(i / 5 * 6.283) * 13}" cy="${-44 + Math.sin(i / 5 * 6.283) * 13}" rx="7" ry="5" fill="#e8829b"/>`).join("") + `</g>`; }).join(""),
  "#cfe9f7");

pics["tornseglaren"] = svg(
  cloud(180, 90, 1.1) + cloud(560, 60, .8) + cloud(700, 150, .6) + sun(80, 60, 28) +
  // seglare (måsvinge-form)
  ["400,140,1.6,#2d2a26", "540,220,1.1,#3c3833", "260,240,.9,#3c3833", "640,100,.8,#46423c"].map((s) => { const [x, y, k, c] = s.split(","); return `<g transform="translate(${x},${y}) scale(${k})"><path d="M0,0 q-38,-30 -78,-16 q34,4 60,26 q-8,18 -22,30 q22,-8 32,-26 q10,18 32,26 q-14,-12 -22,-30 q26,-22 60,-26 q-40,-14 -78,16" fill="${c}"/></g>`; }).join("") +
  // hustak nederst
  `<g transform="translate(0,360)"><polygon points="40,90 40,30 130,-12 220,30 220,90" fill="#b06a52"/><rect x="240,30" y="0"/><polygon points="240,90 240,16 330,-26 420,16 420,90" fill="#c07b5e"/><polygon points="440,90 440,34 540,-8 640,34 640,90" fill="#a86048"/><rect x="660" y="20" width="120" height="70" fill="#b06a52"/><polygon points="650,20 720,-30 790,20" fill="#8d4f3c"/>` +
  `<rect x="100" y="36" width="24" height="54" fill="#8d4f3c"/><rect x="306" y="22" width="22" height="34" fill="#9a5a44"/></g>`,
  "#bfe0f2");

// ---------- ÅK 6 SKRIVA ----------
pics["dorren"] = svg(
  `<rect width="${W}" height="${H}" fill="#2c2438"/>` +
  `<rect x="60" y="60" width="680" height="330" fill="#3a3050"/>` +
  // golv
  `<rect x="0" y="360" width="${W}" height="90" fill="#241d30"/>` +
  Array.from({ length: 6 }, (_, i) => `<line x1="${80 + i * 130}" y1="450" x2="${140 + i * 130}" y2="360" stroke="#312846" stroke-width="3"/>`).join("") +
  // dörren på glänt med ljus
  `<g transform="translate(400,360)"><rect x="-95" y="-260" width="190" height="260" fill="#1c1626"/>` +
  `<polygon points="-20,-252 90,-260 90,0 -20,0" fill="#fff3c4" opacity=".9"/>` +
  `<polygon points="-20,-252 -78,-246 -78,-6 -20,0" fill="#5e8c5a"/><polygon points="-72,-240 -26,-244 -26,-8 -72,-12" fill="#4e7a4c"/>` +
  `<circle cx="-34" cy="-120" r="7" fill="#caa05a"/>` +
  // ljusstrimma på golvet
  `<polygon points="-20,0 90,0 220,80 30,80" fill="#fff3c4" opacity=".35"/></g>` +
  // nyckel
  `<g transform="translate(580,400) rotate(18)" fill="#caa05a"><circle cx="-26" cy="0" r="13" fill="none" stroke="#caa05a" stroke-width="7"/><rect x="-12" y="-4" width="52" height="8" rx="3"/><rect x="26" y="2" width="7" height="12"/><rect x="36" y="2" width="7" height="9"/></g>` +
  // spindelnät
  `<g stroke="#5a4d75" stroke-width="2" fill="none"><path d="M60,60 l70,54 M60,60 l38,80 M60,60 l96,28 M84,96 q24,-10 44,4 M70,128 q30,-18 70,-6"/></g>`,
  "#2c2438");

pics["lyssna"] = svg(
  hill(490, 150, "#a8d88f") + sun(710, 80, 30) +
  // megafon
  `<g transform="translate(250,250) rotate(-12)"><polygon points="0,-44 110,-86 110,86 0,44" fill="#e8694a"/><rect x="-60" y="-44" width="64" height="88" rx="16" fill="#d35d3f"/><rect x="-34" y="44" width="26" height="56" rx="8" fill="#b14e35"/><circle cx="110" cy="0" r="14" fill="#b14e35"/></g>` +
  // ljudbågar
  `<g stroke="#e8694a" stroke-width="7" fill="none" stroke-linecap="round" opacity=".75"><path d="M400,160 q26,60 0,120"/><path d="M440,135 q40,84 0,168"/><path d="M480,110 q54,108 0,216"/></g>` +
  // pratbubblor
  `<g><rect x="520" y="120" width="150" height="64" rx="18" fill="#ffffff"/><polygon points="560,184 580,184 552,210" fill="#ffffff"/><circle cx="560" cy="152" r="7" fill="#3f7fb5"/><circle cx="592" cy="152" r="7" fill="#3f7fb5"/><circle cx="624" cy="152" r="7" fill="#3f7fb5"/></g>` +
  `<g><rect x="560" y="240" width="120" height="56" rx="16" fill="#ffd66b"/><polygon points="596,296 614,296 590,318" fill="#ffd66b"/><text x="620" y="278" font-family="Georgia,serif" font-size="34" font-weight="bold" fill="#7a5a16" text-anchor="middle">!</text></g>`,
  "#dceefb");

pics["varfor-da"] = svg(
  hill(500, 150, "#b8d4e8") +
  // glödlampa
  `<g transform="translate(400,210)"><circle cx="0" cy="0" r="86" fill="#ffd66b"/><circle cx="0" cy="0" r="86" fill="none" stroke="#e8b73e" stroke-width="5"/><path d="M-26,70 q0,26 26,26 q26,0 26,-26" fill="#ffd66b" stroke="#e8b73e" stroke-width="5"/><rect x="-26" y="92" width="52" height="34" rx="8" fill="#9db8cc"/><line x1="-22" y1="104" x2="22" y2="104" stroke="#7d99ad" stroke-width="5"/><line x1="-22" y1="116" x2="22" y2="116" stroke="#7d99ad" stroke-width="5"/>` +
  `<text x="0" y="32" font-family="Georgia,serif" font-size="104" font-weight="bold" fill="#8a5a14" text-anchor="middle">?</text></g>` +
  // strålar
  `<g stroke="#e8b73e" stroke-width="7" stroke-linecap="round"><line x1="400" y1="74" x2="400" y2="34" transform="rotate(0 400 210)"/><line x1="400" y1="74" x2="400" y2="34" transform="rotate(40 400 210)"/><line x1="400" y1="74" x2="400" y2="34" transform="rotate(-40 400 210)"/><line x1="400" y1="74" x2="400" y2="34" transform="rotate(75 400 210)"/><line x1="400" y1="74" x2="400" y2="34" transform="rotate(-75 400 210)"/></g>` +
  // små frågetecken
  `<text x="160" y="160" font-family="Georgia,serif" font-size="64" font-weight="bold" fill="#7d99ad" transform="rotate(-12 160 160)">?</text>` +
  `<text x="640" y="190" font-family="Georgia,serif" font-size="76" font-weight="bold" fill="#7d99ad" transform="rotate(10 640 190)">?</text>` +
  `<text x="600" y="380" font-family="Georgia,serif" font-size="48" font-weight="bold" fill="#9db8cc" transform="rotate(-8 600 380)">?</text>` +
  `<text x="200" y="380" font-family="Georgia,serif" font-size="48" font-weight="bold" fill="#9db8cc" transform="rotate(8 200 380)">?</text>`,
  "#dceefb");

pics["lar-ut"] = svg(
  `<rect width="${W}" height="${H}" fill="#f7e8d8"/>` +
  `<rect x="0" y="330" width="${W}" height="120" fill="#c9756a"/>` + // bord
  `<rect x="0" y="330" width="${W}" height="14" fill="#b56459"/>` +
  // tallrik med pannkakshög
  `<ellipse cx="380" cy="356" rx="190" ry="32" fill="#ffffff"/><ellipse cx="380" cy="349" rx="172" ry="26" fill="#eef2f5"/>` +
  Array.from({ length: 5 }, (_, i) => `<ellipse cx="380" cy="${334 - i * 22}" rx="${150 - i * 8}" ry="20" fill="${i % 2 ? "#e8b35e" : "#d99c43"}"/><ellipse cx="380" cy="${328 - i * 22}" rx="${150 - i * 8}" ry="16" fill="${i % 2 ? "#f0c478" : "#e3ad58"}"/>`).join("") +
  // sylt + smörklick
  `<path d="M310,222 q70,-26 140,0 q-8,26 -30,30 q8,16 -12,22 q-30,10 -56,-2 q-22,-4 -28,-22 q-18,-8 -14,-28" fill="#c0392b"/><ellipse cx="380" cy="214" rx="26" ry="12" fill="#ffe9a8"/>` +
  // stekspade
  `<g transform="translate(640,250) rotate(24)"><rect x="-10" y="-130" width="20" height="120" rx="8" fill="#7a5536"/><rect x="-34" y="-14" width="68" height="78" rx="14" fill="#9db8cc"/><line x1="-14" y1="6" x2="-14" y2="48" stroke="#7d99ad" stroke-width="6"/><line x1="14" y1="6" x2="14" y2="48" stroke="#7d99ad" stroke-width="6"/></g>` +
  // ånga
  `<g stroke="#cdb6a2" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"><path d="M330,180 q-10,-26 6,-44"/><path d="M380,170 q-10,-26 6,-44"/><path d="M430,180 q-10,-26 6,-44"/></g>`,
  "#f7e8d8");

pics["djurboken"] = svg(
  cloud(620, 70, .9) + sun(90, 80, 30) +
  hill(480, 150, "#a8d88f") + gran(120, 300, 1.2) + gran(200, 320, .9) + gran(700, 310, 1.1) +
  // räv
  `<g transform="translate(440,330)">` +
  `<path d="M-60,40 q-50,-10 -44,-62 q4,-34 44,-44 q10,-30 34,-30 q24,0 34,30 q40,10 44,44 q6,52 -44,62 z" fill="#e07b39" opacity="0"/>` +
  // kropp sittande
  `<path d="M-30,40 q-26,-66 24,-96 q56,-30 84,18 q16,30 4,78 z" fill="#e07b39"/>` +
  `<path d="M22,40 q4,-44 36,-58 q14,28 6,58 z" fill="#f2e2cf"/>` +
  // huvud
  `<g transform="translate(-26,-78)"><polygon points="-34,-26 -22,-58 -2,-30" fill="#e07b39"/><polygon points="34,-26 22,-58 2,-30" fill="#e07b39"/><polygon points="-28,-32 -22,-48 -12,-34" fill="#5e4534"/><polygon points="28,-32 22,-48 12,-34" fill="#5e4534"/>` +
  `<circle cx="0" cy="-8" r="34" fill="#e07b39"/><path d="M-18,2 q18,26 36,0 q-6,22 -18,22 q-12,0 -18,-22" fill="#f2e2cf"/><circle cx="-12" cy="-12" r="4.5" fill="#3a2d20"/><circle cx="12" cy="-12" r="4.5" fill="#3a2d20"/><circle cx="0" cy="4" r="6" fill="#3a2d20"/></g>` +
  // svans
  `<path d="M64,36 q66,6 78,-48 q4,-20 -12,-26 q4,30 -28,40 q-26,8 -38,34 z" fill="#e07b39"/><path d="M120,-30 q14,4 10,18 q-6,22 -28,26 q14,-22 18,-44" fill="#f2e2cf"/>` +
  `<ellipse cx="10" cy="44" rx="92" ry="9" fill="#88b873"/></g>`,
  "#cfe9f7");

// ---------- ÅK 9 LÄSA ----------
pics["kungen"] = svg(
  `<rect width="${W}" height="${H}" fill="#4a3b56"/>` +
  // schackbräde i perspektiv (flat)
  `<g transform="translate(400,300)">` +
  (() => { let s = `<rect x="-260" y="-110" width="520" height="220" rx="6" fill="#d9c8a8"/>`; const n = 8; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { if ((r + c) % 2) s += `<rect x="${-240 + c * 60}" y="${-100 + r * 25}" width="60" height="25" fill="#7a5a44"/>`; } return s; })() + `</g>` +
  // kung
  `<g transform="translate(310,210)" fill="#f5efe2"><rect x="-7" y="-92" width="14" height="8"/><rect x="-3" y="-100" width="6" height="22"/><rect x="-12" y="-96" width="24" height="6"/><path d="M-18,-72 q18,12 36,0 l-6,40 q-12,6 -24,0 z"/><ellipse cx="0" cy="-26" rx="22" ry="9"/><path d="M-24,-24 l8,44 q16,8 32,0 l8,-44 z"/><ellipse cx="0" cy="22" rx="30" ry="10"/></g>` +
  // springare (svart)
  `<g transform="translate(490,190)" fill="#2d2433"><path d="M-22,40 q-8,-44 10,-72 q12,-22 36,-26 q4,8 -2,14 q18,2 22,18 q4,16 -10,18 q-12,2 -20,-6 q-4,18 4,54 z"/><ellipse cx="0" cy="44" rx="32" ry="10"/><circle cx="14" cy="-34" r="3.5" fill="#f5efe2"/></g>` +
  // kanelbulle på fat
  `<g transform="translate(650,120)"><ellipse cx="0" cy="26" rx="56" ry="14" fill="#f5efe2"/><circle cx="0" cy="0" r="36" fill="#b3854f"/><path d="M0,0 m-26,0 a26,26 0 1 1 52,0 a20,20 0 1 0 -40,0 a13,13 0 1 1 26,0" fill="none" stroke="#8a6038" stroke-width="8" stroke-linecap="round"/><circle cx="-12" cy="-14" r="2.5" fill="#fff"/><circle cx="10" cy="-18" r="2.5" fill="#fff"/><circle cx="18" cy="-2" r="2.5" fill="#fff"/></g>`,
  "#4a3b56");

pics["esport"] = svg(
  `<rect width="${W}" height="${H}" fill="#1c1430"/>` +
  // storbildsskärm
  `<rect x="200" y="50" width="400" height="150" rx="10" fill="#3b2d63" stroke="#6d5bb8" stroke-width="5"/>` +
  `<polygon points="260,160 330,90 390,140 470,80 540,150" fill="none" stroke="#6fe3c1" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<circle cx="540" cy="150" r="9" fill="#6fe3c1"/><circle cx="330" cy="90" r="9" fill="#e85d8a"/>` +
  // scenglöd
  `<polygon points="160,200 640,200 720,450 80,450" fill="#27204a"/>` +
  // två spelbord
  ["260", "460"].map((x, i) => `<g transform="translate(${x},330)"><rect x="-70" y="0" width="140" height="14" rx="4" fill="#3b2d63"/><rect x="-60" y="14" width="12" height="60" fill="#322757"/><rect x="48" y="14" width="12" height="60" fill="#322757"/><rect x="-44" y="-28" width="62" height="30" rx="4" fill="#0e0a1c" stroke="#${i ? "e85d8a" : "6fe3c1"}" stroke-width="3"/>` + person(40, 0, .85, i ? "#e85d8a" : "#6fe3c1") + `</g>`).join("") +
  // publik (prickar)
  Array.from({ length: 16 }, (_, i) => `<circle cx="${60 + i * 46}" cy="${424 + (i % 2) * 10}" r="11" fill="#0e0a1c"/>`).join("") +
  // strålkastare
  `<polygon points="120,0 200,0 320,200 240,200" fill="#6fe3c1" opacity=".1"/><polygon points="680,0 600,0 480,200 560,200" fill="#e85d8a" opacity=".1"/>`,
  "#1c1430");

pics["jocke"] = svg(
  `<rect width="${W}" height="${H}" fill="#f2a65e"/>` +
  `<rect x="0" y="0" width="${W}" height="160" fill="#ef9352"/>` +
  sun(400, 230, 64, "#ffe27a") +
  // vatten
  `<rect x="0" y="270" width="${W}" height="180" fill="#3f6f8e"/>` +
  `<g stroke="#ffe27a" stroke-width="4" opacity=".6"><line x1="340" y1="300" x2="460" y2="300"/><line x1="360" y1="330" x2="440" y2="330"/><line x1="320" y1="370" x2="480" y2="370"/></g>` +
  // bro (betong)
  `<rect x="0" y="240" width="${W}" height="34" fill="#5e6b7a"/>` +
  Array.from({ length: 5 }, (_, i) => `<rect x="${60 + i * 160}" y="274" width="26" height="${110 + (i % 2) * 14}" fill="#525d6b"/>`).join("") +
  // två siluetter som sitter på kanten
  `<g fill="#2d2a30"><g transform="translate(330,222)"><circle cx="0" cy="-34" r="13"/><rect x="-13" y="-22" width="26" height="30" rx="8"/><rect x="-12" y="8" width="9" height="34" rx="4"/><rect x="3" y="8" width="9" height="34" rx="4"/></g>` +
  `<g transform="translate(385,224)"><circle cx="0" cy="-30" r="11"/><rect x="-11" y="-20" width="22" height="26" rx="7"/><rect x="-10" y="6" width="8" height="30" rx="4"/><rect x="2" y="6" width="8" height="30" rx="4"/></g></g>` +
  // moped
  `<g transform="translate(600,214)" fill="#2d2a30"><circle cx="-30" cy="14" r="14" fill="none" stroke="#2d2a30" stroke-width="6"/><circle cx="34" cy="14" r="14" fill="none" stroke="#2d2a30" stroke-width="6"/><path d="M-30,14 q10,-26 36,-22 l16,-12 q8,-2 10,6 l-6,10 q16,4 8,18" fill="none" stroke="#2d2a30" stroke-width="7" stroke-linecap="round"/><rect x="-6,-10" width="20" height="8"/></g>` +
  // fåglar
  `<path d="M120,90 q10,-12 20,0 q10,-12 20,0 M620,60 q9,-10 18,0 q9,-10 18,0" stroke="#7a4a2d" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  "#f2a65e");

pics["ljudbok"] = svg(
  `<rect width="${W}" height="${H}" fill="#eadcf3"/>` +
  // bok
  `<g transform="translate(400,250)"><path d="M-170,80 q85,-30 170,0 q85,-30 170,0 l0,-170 q-85,-30 -170,0 q-85,-30 -170,0 z" fill="#fdf6e3" stroke="#b9a0cc" stroke-width="5"/><line x1="0" y1="-96" x2="0" y2="78" stroke="#b9a0cc" stroke-width="5"/>` +
  Array.from({ length: 4 }, (_, i) => `<line x1="-140" y1="${-66 + i * 32}" x2="-28" y2="${-72 + i * 32}" stroke="#cdbada" stroke-width="6" stroke-linecap="round"/><line x1="28" y1="${-72 + i * 32}" x2="140" y2="${-66 + i * 32}" stroke="#cdbada" stroke-width="6" stroke-linecap="round"/>`).join("") + `</g>` +
  // hörlurar runt boken
  `<path d="M180,260 q-30,-180 220,-190 q250,10 220,190" stroke="#5b4a73" stroke-width="16" fill="none" stroke-linecap="round"/>` +
  `<rect x="150" y="240" width="58" height="92" rx="26" fill="#5b4a73"/><rect x="592" y="240" width="58" height="92" rx="26" fill="#5b4a73"/>` +
  `<rect x="164" y="254" width="30" height="64" rx="14" fill="#8a76a8"/><rect x="606" y="254" width="30" height="64" rx="14" fill="#8a76a8"/>` +
  // ljudvågor
  `<g stroke="#8a76a8" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"><path d="M110,250 q-16,36 0,72" /><path d="M76,236 q-26,52 0,104"/><path d="M690,250 q16,36 0,72"/><path d="M724,236 q26,52 0,104"/></g>` +
  // not
  `<g fill="#5b4a73" transform="translate(400,96)"><ellipse cx="-12" cy="14" rx="9" ry="7"/><rect x="-5" y="-22" width="4" height="36"/><path d="M-1,-22 q14,4 16,14 q-8,-4 -16,-6 z"/></g>`,
  "#eadcf3");

pics["tidsomstallning"] = svg(
  // delad bakgrund dag/natt
  `<rect width="${W / 2}" height="${H}" fill="#bfe0f2"/><rect x="${W / 2}" width="${W / 2}" height="${H}" fill="#1d2c4e"/>` +
  sun(120, 90, 34) + cloud(220, 160, .7) +
  `<circle cx="690" cy="90" r="30" fill="#f4eecb"/><circle cx="679" cy="83" r="24" fill="#1d2c4e" opacity=".4"/>` +
  star(580, 70) + star(640, 160, 2.5) + star(740, 200) + star(610, 240, 2) +
  // stor klocka i mitten
  `<g transform="translate(400,225)"><circle cx="0" cy="0" r="130" fill="#fdf6e3" stroke="#41526b" stroke-width="10"/>` +
  Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<line x1="${Math.sin(a) * 108}" y1="${-Math.cos(a) * 108}" x2="${Math.sin(a) * 118}" y2="${-Math.cos(a) * 118}" stroke="#41526b" stroke-width="${i % 3 ? 4 : 8}"/>`; }).join("") +
  `<line x1="0" y1="0" x2="0" y2="-72" stroke="#41526b" stroke-width="10" stroke-linecap="round"/><line x1="0" y1="0" x2="52" y2="30" stroke="#41526b" stroke-width="10" stroke-linecap="round"/><circle cx="0" cy="0" r="10" fill="#c9556a"/></g>` +
  // pilar fram/tillbaka
  `<g fill="none" stroke="#c9556a" stroke-width="12" stroke-linecap="round"><path d="M160,380 q60,46 150,52"/><path d="M640,380 q-60,46 -150,52"/></g>` +
  `<polygon points="316,444 296,416 332,420" fill="#c9556a"/><polygon points="484,444 504,416 468,420" fill="#c9556a"/>`,
  "#bfe0f2");

pics["veta-vad-man-vill"] = svg(
  cloud(180, 70, 1) + cloud(560, 100, .7) + sun(710, 70, 28) +
  hill(480, 150, "#a8d88f") +
  // väg som delar sig
  `<path d="M380,450 q0,-90 -130,-160 M420,450 q0,-90 130,-160" stroke="#d9c08a" stroke-width="56" fill="none"/>` +
  `<path d="M400,450 l0,-110" stroke="#d9c08a" stroke-width="56"/>` +
  // vägvisare
  `<g transform="translate(400,210)"><rect x="-9" y="0" width="18" height="130" fill="#7a5536"/>` +
  `<g transform="translate(0,-4)"><polygon points="-10,-16 96,-16 122,0 96,16 -10,16" fill="#caa05a"/></g>` +
  `<g transform="translate(0,-50)"><polygon points="10,-16 -96,-16 -122,0 -96,16 10,16" fill="#b3854f"/></g>` +
  `<g transform="translate(0,-96)"><polygon points="-10,-16 84,-16 110,0 84,16 -10,16" fill="#caa05a"/></g>` +
  `<text x="44" y="-44" font-family="Georgia,serif" font-size="26" font-weight="bold" fill="#5e4322" text-anchor="middle">?</text><text x="-44" y="2" font-family="Georgia,serif" font-size="26" font-weight="bold" fill="#5e4322" text-anchor="middle">?</text><text x="40" y="-90" font-family="Georgia,serif" font-size="26" font-weight="bold" fill="#5e4322" text-anchor="middle">?</text></g>` +
  // figur med ryggsäck
  `<g transform="translate(260,366)">` + person(0, 0, 1.3, "#3f7fb5") + `<rect x="-26" y="-72" width="20" height="34" rx="8" fill="#c9556a"/></g>`,
  "#dceefb");

// ---------- ÅK 9 SKRIVA ----------
pics["uppkopplad"] = svg(
  `<rect width="${W}" height="${H}" fill="#243049"/>` +
  `<circle cx="120" cy="80" r="26" fill="#f4eecb"/><circle cx="111" cy="74" r="20" fill="#243049" opacity=".4"/>` +
  star(220, 60) + star(60, 180, 2.5) + star(300, 130, 2) + star(180, 240) +
  // telefon
  `<g transform="translate(420,240)"><rect x="-90" y="-160" width="180" height="320" rx="26" fill="#0e1322" stroke="#5d6f93" stroke-width="6"/><rect x="-74" y="-140" width="148" height="270" rx="12" fill="#1c2840"/><circle cx="0" cy="148" r="0" fill="#5d6f93"/>` +
  // notiser
  Array.from({ length: 3 }, (_, i) => `<rect x="-62" y="${-120 + i * 56}" width="124" height="42" rx="10" fill="#2c3c5e"/><circle cx="${-42}" cy="${-99 + i * 56}" r="11" fill="${["#e8694a", "#6fe3c1", "#ffd66b"][i]}"/><rect x="-24" y="${-106 + i * 56}" width="70" height="6" rx="3" fill="#5d6f93"/><rect x="-24" y="${-94 + i * 56}" width="46" height="6" rx="3" fill="#41526b"/>`).join("") + `</g>` +
  // notisbubblor som flyger
  `<g font-family="Georgia,serif" font-weight="bold">` +
  ["570,120,#e8694a,3", "640,210,#6fe3c1,1", "590,310,#ffd66b,7", "250,330,#e8694a,2"].map((s) => { const [x, y, c, n] = s.split(","); return `<g transform="translate(${x},${y})"><circle cx="0" cy="0" r="24" fill="${c}"/><text x="0" y="9" font-size="26" fill="#243049" text-anchor="middle">${n}</text></g>`; }).join("") + `</g>` +
  `<path d="M540,140 q-18,30 -36,38 M620,232 q-22,18 -44,20 M566,318 q-22,2 -40,-12" stroke="#41526b" stroke-width="3" fill="none" stroke-dasharray="5 6"/>`,
  "#243049");

pics["debatt"] = svg(
  `<rect width="${W}" height="${H}" fill="#f2e8da"/>` +
  // två stora pratbubblor mot varandra
  `<g><path d="M120,110 h240 a22,22 0 0 1 22,22 v110 a22,22 0 0 1 -22,22 h-150 l-40,46 6,-46 h-56 a22,22 0 0 1 -22,-22 v-110 a22,22 0 0 1 22,-22 z" fill="#3f7fb5"/>` +
  `<text x="240" y="200" font-family="Georgia,serif" font-size="64" font-weight="bold" fill="#fff" text-anchor="middle">JA!</text></g>` +
  `<g><path d="M680,150 h-240 a22,22 0 0 0 -22,22 v110 a22,22 0 0 0 22,22 h150 l40,46 -6,-46 h56 a22,22 0 0 0 22,-22 v-110 a22,22 0 0 0 -22,-22 z" fill="#c9556a"/>` +
  `<text x="560" y="240" font-family="Georgia,serif" font-size="64" font-weight="bold" fill="#fff" text-anchor="middle">NEJ!</text></g>` +
  // blixt i mitten
  `<polygon points="402,196 380,250 398,250 376,310 422,242 402,242 420,196" fill="#ffd66b" stroke="#e8b73e" stroke-width="3"/>` +
  // två talare nederst
  person(180, 430, 1.4, "#3f7fb5") + person(620, 430, 1.4, "#c9556a"),
  "#f2e8da");

pics["utredande"] = svg(
  `<rect width="${W}" height="${H}" fill="#e8eef2"/>` +
  // balansvåg
  `<g transform="translate(400,120)">` +
  `<rect x="-10" y="0" width="20" height="210" fill="#5e6b7a"/><polygon points="-70,250 70,250 50,210 -50,210" fill="#5e6b7a"/>` +
  `<rect x="-220" y="-10" width="440" height="16" rx="8" fill="#41526b" transform="rotate(-6 0 0)"/>` +
  `<circle cx="0" cy="-16" r="14" fill="#c9556a"/>` +
  // vänster skål (lägre)
  `<g transform="translate(-218,-32)"><line x1="0" y1="0" x2="-50" y2="64" stroke="#41526b" stroke-width="5"/><line x1="0" y1="0" x2="50" y2="64" stroke="#41526b" stroke-width="5"/><path d="M-78,64 a78,44 0 0 0 156,0 z" fill="#3f7fb5"/><text x="0" y="100" font-family="Georgia,serif" font-size="32" font-weight="bold" fill="#fff" text-anchor="middle">FÖR</text></g>` +
  // höger skål (högre)
  `<g transform="translate(218,-76)"><line x1="0" y1="0" x2="-50" y2="64" stroke="#41526b" stroke-width="5"/><line x1="0" y1="0" x2="50" y2="64" stroke="#41526b" stroke-width="5"/><path d="M-78,64 a78,44 0 0 0 156,0 z" fill="#c9556a"/><text x="0" y="100" font-family="Georgia,serif" font-size="28" font-weight="bold" fill="#fff" text-anchor="middle">EMOT</text></g></g>` +
  // dokument
  `<g transform="translate(130,360) rotate(-8)"><rect x="-44" y="-58" width="88" height="116" rx="6" fill="#fff" stroke="#b9c4cc" stroke-width="3"/>` + Array.from({ length: 5 }, (_, i) => `<line x1="-30" y1="${-38 + i * 18}" x2="30" y2="${-38 + i * 18}" stroke="#b9c4cc" stroke-width="5" stroke-linecap="round"/>`).join("") + `</g>` +
  `<g transform="translate(670,360) rotate(7)"><rect x="-44" y="-58" width="88" height="116" rx="6" fill="#fff" stroke="#b9c4cc" stroke-width="3"/>` + Array.from({ length: 5 }, (_, i) => `<line x1="-30" y1="${-38 + i * 18}" x2="30" y2="${-38 + i * 18}" stroke="#b9c4cc" stroke-width="5" stroke-linecap="round"/>`).join("") + `</g>`,
  "#e8eef2");

pics["resonerande"] = svg(
  `<rect width="${W}" height="${H}" fill="#ddeae4"/>` +
  // profilhuvud
  `<g transform="translate(290,260)"><path d="M-90,140 q-50,-40 -44,-120 q6,-90 100,-104 q96,-14 124,62 q12,34 -2,66 q22,10 14,30 q-6,12 -22,12 q6,18 -8,26 q-10,6 -24,2 q2,22 -20,26 q-44,8 -50,-22 q-36,4 -68,22 z" fill="#f3c39e"/><path d="M-94,-58 q30,-66 110,-66 q66,0 88,44 q-66,-18 -120,4 q-50,20 -78,18" fill="#5b3a23"/></g>` +
  // tankebubblor som väger
  `<circle cx="430" cy="170" r="9" fill="#fff"/><circle cx="466" cy="130" r="13" fill="#fff"/>` +
  `<g><circle cx="560" cy="90" r="52" fill="#fff"/><text x="560" y="108" font-family="Georgia,serif" font-size="52" font-weight="bold" fill="#3f7fb5" text-anchor="middle">?</text></g>` +
  `<g><circle cx="660" cy="200" r="44" fill="#fff"/><text x="660" y="216" font-family="Georgia,serif" font-size="44" font-weight="bold" fill="#c9556a" text-anchor="middle">?</text></g>` +
  `<g><circle cx="600" cy="320" r="38" fill="#fff"/><text x="600" y="334" font-family="Georgia,serif" font-size="38" font-weight="bold" fill="#5e8c5a" text-anchor="middle">!</text></g>` +
  // sammanbindande prickad väg mellan tankarna
  `<path d="M560,142 q40,20 76,18 M640,238 q-20,44 -40,46" stroke="#9db8cc" stroke-width="4" fill="none" stroke-dasharray="6 8"/>`,
  "#ddeae4");

pics["fagelungen"] = svg(
  sun(110, 80) + cloud(620, 70, .9) + hill(490, 150, "#a8d88f") +
  // gren med bo
  `<path d="M0,250 q200,-30 380,-10 q60,6 120,30" stroke="#7a5536" stroke-width="16" fill="none" stroke-linecap="round"/>` +
  `<path d="M300,238 q10,-30 -10,-46 M420,244 q16,-22 6,-44" stroke="#7a5536" stroke-width="8" fill="none" stroke-linecap="round"/>` +
  // bo
  `<g transform="translate(360,222)"><path d="M-64,0 a64,34 0 0 0 128,0 z" fill="#8a6038"/>` +
  Array.from({ length: 8 }, (_, i) => `<line x1="${-56 + i * 16}" y1="2" x2="${-44 + i * 16}" y2="26" stroke="#6b4a2e" stroke-width="4" stroke-linecap="round"/>`).join("") + `</g>` +
  // fågelunge
  `<g transform="translate(360,196)"><ellipse cx="0" cy="0" rx="30" ry="24" fill="#b08e5e"/><circle cx="18" cy="-18" r="16" fill="#b08e5e"/><polygon points="32,-20 48,-15 32,-10" fill="#e8a13e"/><circle cx="22" cy="-21" r="3.5" fill="#2d2a26"/><path d="M-26,-6 q-12,-4 -16,4 q8,8 18,4 z" fill="#9a7a4e"/></g>` +
  // fågelmamma som flyger in
  `<g transform="translate(580,110)"><ellipse cx="0" cy="0" rx="26" ry="16" fill="#7a5b3a"/><circle cx="22" cy="-8" r="11" fill="#7a5b3a"/><polygon points="32,-9 46,-5 32,-1" fill="#e8a13e"/><circle cx="25" cy="-10" r="2.5" fill="#2d2a26"/><path d="M-6,-8 q-16,-26 8,-30 q8,16 -8,30" fill="#8d6b44"/><path d="M-24,2 q-18,2 -26,12 q12,8 28,0 z" fill="#8d6b44"/></g>` +
  `<ellipse cx="640" cy="146" rx="5" ry="4" fill="#5da06f"/>`,
  "#cfe9f7");

pics["tander"] = svg(
  `<rect width="${W}" height="${H}" fill="#dff0f7"/>` +
  `<circle cx="660" cy="80" r="44" fill="#bfe0f2"/><circle cx="130" cy="370" r="60" fill="#cfe9f7"/>` +
  // stor glad tand
  `<g transform="translate(330,225)"><path d="M-95,-60 q0,-75 95,-75 q95,0 95,75 q0,52 -28,96 q-14,24 -24,64 q-6,22 -22,22 q-14,0 -18,-22 q-2,-16 -3,-26 q-1,16 -3,26 q-4,22 -18,22 q-16,0 -22,-22 q-10,-40 -24,-64 q-28,-44 -28,-96 z" fill="#ffffff" stroke="#9db8cc" stroke-width="6"/>` +
  `<circle cx="-30" cy="-30" r="6" fill="#41526b"/><circle cx="30" cy="-30" r="6" fill="#41526b"/><path d="M-26,6 q26,24 52,0" stroke="#41526b" stroke-width="6" fill="none" stroke-linecap="round"/>` +
  `<ellipse cx="-48" cy="-64" rx="18" ry="26" fill="#eaf4fa" transform="rotate(-20 -48 -64)"/></g>` +
  // tandborste
  `<g transform="translate(570,250) rotate(-35)"><rect x="-16" y="-130" width="32" height="56" rx="10" fill="#e8694a"/>` +
  Array.from({ length: 4 }, (_, i) => `<rect x="${-14 + i * 8}" y="-152" width="6" height="22" rx="3" fill="#ffffff" stroke="#c9d8e2" stroke-width="1"/>`).join("") +
  `<rect x="-12" y="-74" width="24" height="180" rx="12" fill="#3f7fb5"/><rect x="-12" y="20" width="24" height="60" rx="12" fill="#7fb0d8"/></g>` +
  // tandkrämsklick + bubblor
  `<path d="M548,116 q14,-18 30,-8 q16,8 6,24" fill="#9fd8c2"/>` +
  `<circle cx="480" cy="120" r="10" fill="#ffffff" opacity=".8"/><circle cx="510" cy="90" r="7" fill="#ffffff" opacity=".8"/><circle cx="455" cy="85" r="5" fill="#ffffff" opacity=".8"/>`,
  "#dff0f7");

pics["hund"] = svg(
  sun(680, 80) + cloud(180, 70, .9) + hill(470, 150, "#a8d88f") + hill(520, 170, "#8fcb78") +
  // boll
  `<circle cx="610" cy="372" r="22" fill="#e8694a"/><path d="M588,372 a22,22 0 0 1 44,0" fill="none" stroke="#fff" stroke-width="3"/>` +
  // hund (glad, sittande)
  `<g transform="translate(330,300)">` +
  `<ellipse cx="0" cy="86" rx="120" ry="16" fill="#88b873"/>` +
  // svans
  `<path d="M70,30 q56,-10 64,-56 q14,16 2,40 q-14,28 -56,40 z" fill="#caa06a"/>` +
  // kropp
  `<path d="M-44,84 q-30,-70 18,-104 q56,-34 92,18 q20,40 6,86 z" fill="#caa06a"/>` +
  `<path d="M30,84 q6,-50 40,-66 q14,30 4,66 z" fill="#e3cba0"/>` +
  // huvud
  `<g transform="translate(-44,-46)"><circle cx="0" cy="0" r="42" fill="#caa06a"/>` +
  `<path d="M-38,-18 q-22,-26 -8,-50 q26,8 30,40 z" fill="#a87f48"/><path d="M38,-18 q22,-26 8,-50 q-26,8 -30,40 z" fill="#a87f48"/>` +
  `<ellipse cx="0" cy="14" rx="26" ry="22" fill="#e3cba0"/>` +
  `<circle cx="-14" cy="-6" r="5" fill="#3a2d20"/><circle cx="14" cy="-6" r="5" fill="#3a2d20"/>` +
  `<ellipse cx="0" cy="10" rx="8" ry="6" fill="#3a2d20"/><path d="M0,16 q0,12 -10,14 M0,16 q0,12 10,14" stroke="#3a2d20" stroke-width="3" fill="none"/>` +
  `<path d="M2,22 q14,4 22,-2" stroke="#c0392b" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>`,
  "#cfe9f7");

pics["atervinning"] = svg(
  sun(110, 80) + cloud(640, 70, .9) + hill(480, 160, "#a8d88f") +
  // tre kärl
  [["#3f7fb5", "PAPPER", 250], ["#e8b73e", "PLAST", 400], ["#5e8c5a", "GLAS", 550]].map(([c, label, x]) =>
    `<g transform="translate(${x},250)"><rect x="-58" y="0" width="116" height="150" rx="10" fill="${c}"/><rect x="-58" y="0" width="116" height="26" rx="10" fill="#ffffff" opacity=".25"/>` +
    `<rect x="-34" y="-14" width="68" height="16" rx="6" fill="${c}"/>` +
    // återvinningssymbol
    `<g transform="translate(0,72)" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"><path d="M-16,-6 l10,-16 l10,4"/><path d="M16,2 l-2,18 l-14,-2"/><path d="M-14,14 l-8,-12 l12,-8"/><polygon points="2,-24 -6,-22 -2,-16" fill="#ffffff" stroke="none"/></g>` +
    `<text x="0" y="132" font-family="system-ui,sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">${label}</text></g>`
  ).join("") +
  `<ellipse cx="400" cy="408" rx="320" ry="14" fill="#8fcb78"/>`,
  "#cfe9f7");

pics["skog"] = svg(
  `<rect width="${W}" height="${H}" fill="#cfe9f7"/>` +
  // ljusstrålar
  `<polygon points="300,0 360,0 280,450 200,450" fill="#fff7d6" opacity=".4"/><polygon points="420,0 470,0 520,450 440,450" fill="#fff7d6" opacity=".3"/>` +
  hill(470, 160, "#7fae6e") +
  // stig
  `<path d="M340,450 q60,-150 60,-260 q0,150 60,260 z" fill="#d9c08a"/>` +
  // träd
  gran(120, 300, 1.6, "#3e7d5a") + gran(220, 330, 1.2, "#4a8c66") + gran(680, 300, 1.6, "#3e7d5a") + gran(590, 335, 1.2, "#4a8c66") + gran(710, 360, 1, "#4a8c66") +
  // svamp vid stigen
  `<g transform="translate(450,400)"><rect x="-5" y="-4" width="10" height="18" rx="3" fill="#f0e6d2"/><path d="M-16,-2 a16,12 0 0 1 32,0 z" fill="#d2402f"/><circle cx="-6" cy="-8" r="2.5" fill="#fff"/><circle cx="6" cy="-6" r="2.5" fill="#fff"/></g>`,
  "#cfe9f7");

// Skriv alla filer
for (const [name, content] of Object.entries(pics)) {
  fs.writeFileSync(`${out}/${name}.svg`, content);
}
console.log(Object.keys(pics).length + " illustrationer skapade:");
console.log(Object.keys(pics).join(", "));
