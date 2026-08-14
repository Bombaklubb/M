//
// Gemensam körning för de skript som byter ut frågor mot nya av en viss typ.
//
// Kontrollerna är desamma oavsett sats, och de är värda att ha på ett ställe:
// den viktigaste är att varje svarsalternativ i en textbevis-fråga står
// ordagrant i texten. Utan den vore det lätt att skriva en snarlik mening ur
// minnet, och då blir frågan obesvarbar just för den elev som gör som
// uppgiften säger och letar i texten.

const fs = require('fs');

/**
 * @param {string} libraryPath   sökväg till library.json
 * @param {Array}  poster        [id, frågans index (0-baserat), ny fråga]
 * @param {object} val           { dry, ersatter } – ersatter är den typ som
 *                               förväntas på platsen, normalt 'literal'
 */
function bytUtFragor(libraryPath, poster, { dry = false, ersatter = 'literal' } = {}) {
  const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
  let fel = 0;
  const rader = [];

  for (const [id, index, ny] of poster) {
    const t = lib.find((x) => x.id === id);
    if (!t) {
      console.error(`${id}: finns inte`);
      fel++;
      continue;
    }
    const gammal = (t.questions || [])[index];
    if (!gammal) {
      console.error(`${id}: ingen fråga på plats ${index + 1}`);
      fel++;
      continue;
    }
    if (gammal.type === ny.type) {
      console.error(`${id} f${index + 1}: är redan ${ny.type} – kanske redan körd?`);
      fel++;
      continue;
    }
    if (gammal.type !== ersatter) {
      console.error(`${id} f${index + 1}: har typen ${gammal.type}, förväntade ${ersatter}`);
      fel++;
      continue;
    }
    if (!Array.isArray(ny.options) || ny.options.length !== 4) {
      console.error(`${id} f${index + 1}: ska ha fyra alternativ`);
      fel++;
      continue;
    }
    if (typeof ny.correct !== 'number' || ny.correct < 0 || ny.correct > 3) {
      console.error(`${id} f${index + 1}: ogiltigt facit`);
      fel++;
      continue;
    }

    // Bara textbevis kräver ordagranna citat. En fråga om författarens syfte
    // handlar om varför texten är skriven, och formuleras med egna ord.
    if (ny.type === 'textbevis') {
      ny.options.forEach((o, i) => {
        if (!t.text.includes(o)) {
          console.error(
            `${id} f${index + 1} alternativ ${'ABCD'[i]}: står inte ordagrant i texten\n    "${o}"`
          );
          fel++;
        }
      });
    }

    rader.push({ t, index, gammal, ny });
  }

  if (fel) {
    console.error(`\n${fel} problem – inget skrivet.`);
    process.exit(1);
  }

  console.log('id                åk  ersätter                                        facit');
  for (const r of rader) {
    r.t.questions[r.index] = r.ny;
    console.log(
      `${r.t.id.padEnd(16)} ${String(r.t.grade).padStart(2)}  ` +
        `${r.gammal.q.slice(0, 46).padEnd(48)} ${'ABCD'[r.ny.correct]}`
    );
  }

  const typ = poster[0][2].type;
  const antal = lib.reduce((n, t) => n + t.questions.filter((q) => q.type === typ).length, 0);
  console.log(`\n${rader.length} frågor omgjorda. Frågor av typen ${typ} i biblioteket: ${antal}`);

  if (!dry) {
    fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
    console.log('Skrivet.');
  } else {
    console.log('(dry run – inget skrivet)');
  }
}

module.exports = { bytUtFragor };
