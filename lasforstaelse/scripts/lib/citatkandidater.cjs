//
// Hjälpverktyg för att skriva textbevis-frågor.
//
// En textbevis-fråga har fyra ordagranna meningar ur texten som alternativ.
// Två krav styr vilka meningar som går att använda tillsammans:
//
//   1. De måste stå ordagrant i texten. Annars är frågan obesvarbar för den
//      elev som gör som uppgiften säger och letar i texten.
//   2. De måste vara ungefär lika långa. Validatorn underkänner en fråga där
//      rätt svar är 1,6 gånger längre än den längsta eller kortaste
//      distraktorn, eftersom svaret då går att peka ut utan att läsa texten.
//
// Att leta fram sådana grupper för hand i fyrahundra texter är tidsödande och
// lätt att slarva med. Funktionen nedan gör urvalet, så att arbetet blir att
// formulera påståendet och avgöra vilken mening som faktiskt bär belägget.

/** Delar en text i meningar, med hänsyn till citattecken i slutet. */
function meningar(text) {
  return (text || '')
    .split(/(?<=[.!?]["”]?)\s+/)
    .map((m) => m.trim())
    .filter(Boolean);
}

/**
 * Meningar som duger som svarsalternativ.
 *
 * För korta blir innehållslösa ("Samira stannade."), för långa tar för mycket
 * plats i ett svarsalternativ. Meningar med repliker undviks: ett citat inuti
 * ett citat blir svårläst i en alternativlista.
 */
function anvandbara(text, { min = 45, max = 115 } = {}) {
  return meningar(text).filter(
    (m) => m.length >= min && m.length <= max && !/["”]/.test(m)
  );
}

/**
 * Grupperar meningarna i längdband där kvoten mellan längsta och kortaste
 * håller sig under gränsen. Varje band med minst fyra meningar går att bygga
 * en fråga av.
 */
function langdband(meningarLista, maxKvot = 1.5) {
  const sorterade = [...meningarLista].sort((a, b) => a.length - b.length);
  const band = [];
  for (let i = 0; i < sorterade.length; i++) {
    const grupp = [sorterade[i]];
    for (let j = i + 1; j < sorterade.length; j++) {
      if (sorterade[j].length / grupp[0].length <= maxKvot) grupp.push(sorterade[j]);
      else break;
    }
    if (grupp.length >= 4) band.push(grupp);
  }
  // Behåll det längsta bandet som startar på varje position, men bara om det
  // inte redan täcks helt av ett tidigare band.
  return band.filter((g, i) => i === 0 || g.length > band[i - 1].length - 1);
}

module.exports = { meningar, anvandbara, langdband };
