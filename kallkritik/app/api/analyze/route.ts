import { NextRequest, NextResponse } from "next/server";
import { Report, ChecklistCategory, CheckStatus } from "@/lib/types";

// --------- Rate limit ---------
const rateMap = new Map<string, { count: number; ts: number }>();
function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const v = rateMap.get(key);
  if (!v || now - v.ts > windowMs) {
    rateMap.set(key, { count: 1, ts: now });
    return true;
  }
  if (v.count >= limit) return false;
  v.count += 1;
  rateMap.set(key, v);
  return true;
}

// --------- URL & SSRF-skydd ---------
function normalizeUrl(input: string) {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  const url = new URL(u);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Endast http/https tillåts.");
  return url;
}

function isPrivateIp(hostname: string) {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const a = Number(m[1]), b = Number(m[2]);
  if (a === 10 || a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

// --------- Fetch med timeout + storleksgräns ---------
async function fetchHtml(target: URL) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  const res = await fetch(target.toString(), {
    redirect: "follow",
    signal: controller.signal,
    headers: {
      "user-agent": "KallkritikSpecialisten/1.0 (+educational; safe-fetch)"
    }
  }).finally(() => clearTimeout(timeout));

  const finalUrl = res.url;
  const httpStatus = res.status;

  const reader = res.body?.getReader();
  if (!reader) return { html: "", finalUrl, httpStatus, headers: Object.fromEntries(res.headers.entries()) };

  let received = 0;
  const chunks: Uint8Array[] = [];
  const max = 1_200_000;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    received += value.length;
    if (received > max) break;
    chunks.push(value);
  }
  const html = new TextDecoder("utf-8").decode(Buffer.concat(chunks as unknown as Uint8Array[]));
  return { html, finalUrl, httpStatus, headers: Object.fromEntries(res.headers.entries()) };
}

// --------- Hjälpfunktioner för regelbaserad analys ---------
function lc(html: string) {
  return html.toLowerCase();
}

function hasAny(text: string, patterns: string[]): string[] {
  const t = text.toLowerCase();
  return patterns.filter(p => t.includes(p.toLowerCase()));
}

function countMatches(text: string, patterns: string[]): number {
  const t = text.toLowerCase();
  return patterns.filter(p => t.includes(p.toLowerCase())).length;
}

// --------- Regelbaserad analysmotor ---------
function analyzeRuleBased(args: {
  url: URL;
  finalUrl: string;
  httpStatus: number;
  headers: Record<string, string>;
  html: string;
}): Report {
  const { url, finalUrl, httpStatus, headers, html } = args;
  const text = lc(html);

  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  const unknowns: string[] = [];
  let score = 50; // Startar neutralt

  // ===== A) TEKNIK & SÄKERHET =====
  const isHttps = url.protocol === "https:";
  const hasRedirect = finalUrl !== url.toString();
  const hasCSP = !!headers["content-security-policy"];
  const hasXFrame = !!headers["x-frame-options"];
  const hasHSTS = !!headers["strict-transport-security"];
  const serverHeader = headers["server"] || "";

  if (isHttps) { greenFlags.push("Sidan använder HTTPS (krypterad anslutning)"); score += 8; }
  else { redFlags.push("Sidan använder HTTP utan kryptering"); score -= 15; }

  if (httpStatus >= 200 && httpStatus < 300) { score += 3; }
  else if (httpStatus >= 400) { redFlags.push(`HTTP-status ${httpStatus} (sidan returnerar fel)`); score -= 10; }

  if (hasCSP) { greenFlags.push("Content-Security-Policy header finns"); score += 3; }
  if (hasHSTS) { greenFlags.push("Strict-Transport-Security (HSTS) aktivt"); score += 3; }
  if (hasXFrame) { greenFlags.push("X-Frame-Options header finns (skyddar mot clickjacking)"); score += 2; }

  if (hasRedirect && new URL(finalUrl).hostname !== url.hostname) {
    redFlags.push(`Omdirigering till annan domän: ${new URL(finalUrl).hostname}`);
    score -= 10;
  }

  const techChecks: ChecklistCategory["checks"] = [
    {
      name: "HTTPS",
      status: isHttps ? "ok" : "risk",
      evidence: isHttps ? ["Sidan använder HTTPS"] : ["Sidan använder okrypterad HTTP"],
      tip: isHttps ? "Bra! Anslutningen är krypterad." : "Varning: data skickas okrypterat. Skriv aldrig in lösenord här."
    },
    {
      name: "HTTP-statuskod",
      status: (httpStatus >= 200 && httpStatus < 300) ? "ok" : "warn",
      evidence: [`Statuskod: ${httpStatus}`],
      tip: httpStatus === 200 ? "Normal statuskod." : "Onormal statuskod kan tyda på problem."
    },
    {
      name: "Säkerhetsheaders",
      status: (hasCSP || hasHSTS) ? "ok" : "warn",
      evidence: [
        hasCSP ? "CSP finns" : "CSP saknas",
        hasHSTS ? "HSTS finns" : "HSTS saknas",
        hasXFrame ? "X-Frame-Options finns" : "X-Frame-Options saknas"
      ],
      tip: "Säkerhetsheaders skyddar mot vanliga attacker. Saknas de kan sidan vara mindre säker."
    },
    {
      name: "Omdirigeringar",
      status: hasRedirect ? (new URL(finalUrl).hostname !== url.hostname ? "risk" : "warn") : "ok",
      evidence: hasRedirect ? [`Omdirigerad till ${finalUrl}`] : ["Ingen omdirigering"],
      tip: hasRedirect ? "Omdirigering upptäckt. Kolla att du hamnade där du förväntade dig." : "Ingen omdirigering — bra."
    }
  ];

  // ===== B) IDENTITET & TRANSPARENS =====
  const contactPatterns = ["kontakt", "contact", "telefon", "phone", "e-post", "email", "mailto:"];
  const aboutPatterns = ["om oss", "about us", "about", "om sidan", "redaktion"];
  const policyPatterns = ["integritetspolicy", "privacy policy", "privacy", "gdpr", "dataskydd", "personuppgift"];
  const termsPatterns = ["villkor", "terms", "användarvillkor", "terms of service", "terms of use"];
  const orgPatterns = ["org.nr", "organisationsnummer", "org nr", "vat", "company number"];

  const foundContact = hasAny(text, contactPatterns);
  const foundAbout = hasAny(text, aboutPatterns);
  const foundPolicy = hasAny(text, policyPatterns);
  const foundTerms = hasAny(text, termsPatterns);
  const foundOrg = hasAny(text, orgPatterns);

  if (foundContact.length > 0) { greenFlags.push("Kontaktuppgifter verkar finnas"); score += 8; }
  else { unknowns.push("Inga tydliga kontaktuppgifter hittades"); score -= 5; }

  if (foundAbout.length > 0) { greenFlags.push("Om-sida / avsändare verkar finnas"); score += 6; }
  else { unknowns.push("Ingen tydlig 'Om oss'-sida hittades"); score -= 5; }

  if (foundPolicy.length > 0) { greenFlags.push("Integritetspolicy verkar finnas"); score += 5; }
  else { unknowns.push("Ingen integritetspolicy hittades"); score -= 3; }

  if (foundTerms.length > 0) { greenFlags.push("Villkor/användarvillkor verkar finnas"); score += 4; }

  if (foundOrg.length > 0) { greenFlags.push("Organisationsnummer/företagsinfo verkar finnas"); score += 5; }

  const identityChecks: ChecklistCategory["checks"] = [
    {
      name: "Kontaktuppgifter",
      status: foundContact.length > 0 ? "ok" : "warn",
      evidence: foundContact.length > 0 ? [`Hittade: ${foundContact.join(", ")}`] : ["Inga kontaktuppgifter hittades"],
      tip: "Seriösa sidor har tydliga kontaktuppgifter."
    },
    {
      name: "Om-sida / Avsändare",
      status: foundAbout.length > 0 ? "ok" : "warn",
      evidence: foundAbout.length > 0 ? [`Hittade: ${foundAbout.join(", ")}`] : ["Ingen om-sida hittades"],
      tip: "Vem står bakom? En tydlig avsändare är ett gott tecken."
    },
    {
      name: "Integritetspolicy",
      status: foundPolicy.length > 0 ? "ok" : "warn",
      evidence: foundPolicy.length > 0 ? [`Hittade: ${foundPolicy.join(", ")}`] : ["Ingen policy hittades"],
      tip: "GDPR kräver att sidor informerar om datahantering."
    },
    {
      name: "Villkor",
      status: foundTerms.length > 0 ? "ok" : "unknown",
      evidence: foundTerms.length > 0 ? [`Hittade: ${foundTerms.join(", ")}`] : ["Inga villkor hittades"],
      tip: "Användarvillkor visar att sidan tar ansvar för sin tjänst."
    }
  ];

  // ===== C) INNEHÅLL & KÄLLOR =====
  const datePatterns = ["publicerad", "published", "uppdaterad", "updated", "datum", "date"];
  const sourcePatterns = ["källa", "source", "referens", "reference", "studie", "forskning", "research"];
  const authorPatterns = ["författare", "author", "skribent", "redaktör", "reporter"];

  const foundDates = hasAny(text, datePatterns);
  const foundSources = hasAny(text, sourcePatterns);
  const foundAuthor = hasAny(text, authorPatterns);

  if (foundDates.length > 0) { greenFlags.push("Datum/uppdatering verkar anges"); score += 4; }
  else { unknowns.push("Inget publiceringsdatum hittades"); }

  if (foundSources.length > 0) { greenFlags.push("Källor/referenser verkar finnas"); score += 5; }

  if (foundAuthor.length > 0) { greenFlags.push("Författare/skribent verkar anges"); score += 4; }

  const contentChecks: ChecklistCategory["checks"] = [
    {
      name: "Datum & aktualitet",
      status: foundDates.length > 0 ? "ok" : "unknown",
      evidence: foundDates.length > 0 ? [`Hittade: ${foundDates.join(", ")}`] : ["Inget datum hittades"],
      tip: "Kontrollera att informationen är aktuell."
    },
    {
      name: "Källor & referenser",
      status: foundSources.length > 0 ? "ok" : "unknown",
      evidence: foundSources.length > 0 ? [`Hittade: ${foundSources.join(", ")}`] : ["Inga tydliga källhänvisningar"],
      tip: "Bra information stöds av verifierbara källor."
    },
    {
      name: "Författare",
      status: foundAuthor.length > 0 ? "ok" : "unknown",
      evidence: foundAuthor.length > 0 ? [`Hittade: ${foundAuthor.join(", ")}`] : ["Ingen författare angiven"],
      tip: "Att veta vem som skrivit texten hjälper dig bedöma trovärdighet."
    }
  ];

  // ===== D) INTEGRITET & DATAHANTERING =====
  const trackingPatterns = ["google-analytics", "gtag", "ga(", "fbq(", "facebook pixel", "_ga", "hotjar", "mixpanel", "segment.io"];
  const cookiePatterns = ["cookie", "kakor", "samtycke", "consent"];
  const loginPatterns = ["logga in", "login", "sign in", "lösenord", "password"];

  const foundTracking = hasAny(text, trackingPatterns);
  const foundCookies = hasAny(text, cookiePatterns);
  const foundLogin = hasAny(text, loginPatterns);

  const privacyClaims: string[] = [];
  const trackingIndicators: string[] = [];
  const permissionsConcerns: string[] = [];
  const dataHandlingRisks: string[] = [];

  if (foundTracking.length > 0) {
    trackingIndicators.push(`Spårningskod hittad: ${foundTracking.join(", ")}`);
  }
  if (foundCookies.length > 0) {
    privacyClaims.push("Cookie-info/samtycke verkar finnas");
    score += 2;
  }
  if (foundLogin.length > 0 && !isHttps) {
    dataHandlingRisks.push("Inloggning utan HTTPS — lösenord kan avlyssnas");
    redFlags.push("Inloggningsformulär utan HTTPS");
    score -= 15;
  }

  const privacyChecks: ChecklistCategory["checks"] = [
    {
      name: "Spårning & analytics",
      status: foundTracking.length > 0 ? "warn" : "ok",
      evidence: foundTracking.length > 0 ? [`Hittade: ${foundTracking.join(", ")}`] : ["Inga kända spårare hittades"],
      tip: "De flesta sidor använder analytics. Kontrollera att de informerar om det."
    },
    {
      name: "Cookie-information",
      status: foundCookies.length > 0 ? "ok" : "unknown",
      evidence: foundCookies.length > 0 ? ["Cookie-/samtyckesinfo hittades"] : ["Ingen cookie-info hittades"],
      tip: "Enligt GDPR ska sidor informera om cookies."
    }
  ];

  // ===== E) SCAM/BEDRÄGERI-HEURISTIK =====
  const urgencyPatterns = ["bara idag", "only today", "limited time", "begränsat", "skynda", "sista chansen", "last chance", "agera nu", "act now", "omedelbart", "immediately"];
  const tooGoodPatterns = ["gratis iphone", "free iphone", "du har vunnit", "you have won", "congratulations", "grattis du", "100% gratis", "ingen risk"];
  const paymentSuspect = ["bitcoin", "crypto", "western union", "moneygram", "presentkort", "gift card", "swish direkt"];
  const phishingPatterns = ["bekräfta ditt konto", "verify your account", "din session löper ut", "session expired", "klicka här omedelbart", "uppdatera dina uppgifter", "update your information"];

  const foundUrgency = hasAny(text, urgencyPatterns);
  const foundTooGood = hasAny(text, tooGoodPatterns);
  const foundSuspectPayment = hasAny(text, paymentSuspect);
  const foundPhishing = hasAny(text, phishingPatterns);

  const scamPatterns: string[] = [];

  if (foundUrgency.length > 0) {
    scamPatterns.push(`Brådska/press: ${foundUrgency.join(", ")}`);
    redFlags.push(`Brådska-mönster: ${foundUrgency.join(", ")}`);
    score -= 8 * Math.min(foundUrgency.length, 3);
  }
  if (foundTooGood.length > 0) {
    scamPatterns.push(`"För bra för att vara sant": ${foundTooGood.join(", ")}`);
    redFlags.push(`Misstänkt erbjudande: ${foundTooGood.join(", ")}`);
    score -= 12 * Math.min(foundTooGood.length, 2);
  }
  if (foundSuspectPayment.length > 0) {
    scamPatterns.push(`Suspekt betalmetod: ${foundSuspectPayment.join(", ")}`);
    redFlags.push(`Ovanlig betalmetod nämns: ${foundSuspectPayment.join(", ")}`);
    score -= 10;
  }
  if (foundPhishing.length > 0) {
    scamPatterns.push(`Phishing-mönster: ${foundPhishing.join(", ")}`);
    redFlags.push(`Möjligt nätfiske: ${foundPhishing.join(", ")}`);
    score -= 15;
  }

  const paymentRisk: "low" | "medium" | "high" | "unknown" =
    foundSuspectPayment.length > 0 ? "high" :
    foundTooGood.length > 0 ? "medium" : "low";

  const impersonationRisk: "low" | "medium" | "high" | "unknown" =
    foundPhishing.length > 0 ? "high" :
    (foundUrgency.length > 1) ? "medium" : "low";

  const scamChecks: ChecklistCategory["checks"] = [
    {
      name: "Brådska & press",
      status: foundUrgency.length > 0 ? "risk" : "ok",
      evidence: foundUrgency.length > 0 ? foundUrgency : ["Inga brådska-mönster hittades"],
      tip: "Bedragare använder ofta tidspress för att hindra dig från att tänka efter."
    },
    {
      name: "\"För bra för att vara sant\"",
      status: foundTooGood.length > 0 ? "risk" : "ok",
      evidence: foundTooGood.length > 0 ? foundTooGood : ["Inga orealistiska erbjudanden hittades"],
      tip: "Om det verkar för bra — är det troligen det."
    },
    {
      name: "Suspekta betalmetoder",
      status: foundSuspectPayment.length > 0 ? "risk" : "ok",
      evidence: foundSuspectPayment.length > 0 ? foundSuspectPayment : ["Inga suspekta betalmetoder hittades"],
      tip: "Seriösa företag använder etablerade betalmetoder."
    },
    {
      name: "Nätfiske-mönster",
      status: foundPhishing.length > 0 ? "risk" : "ok",
      evidence: foundPhishing.length > 0 ? foundPhishing : ["Inga phishing-mönster hittades"],
      tip: "Var försiktig med sidor som ber dig bekräfta konto via e-post/sms-länk."
    }
  ];

  // ===== F) AFFÄRSMODELL & INCITAMENT =====
  const adPatterns = ["adsense", "ad_client", "doubleclick", "googlesyndication", "adsbygoogle", "sponsor", "annons", "reklam"];
  const ecomPatterns = ["varukorg", "cart", "checkout", "köp", "buy now", "add to cart", "lägg i varukorgen", "shopify", "woocommerce"];

  const foundAds = hasAny(text, adPatterns);
  const foundEcom = hasAny(text, ecomPatterns);

  const businessChecks: ChecklistCategory["checks"] = [
    {
      name: "Reklam & annonser",
      status: foundAds.length > 0 ? "warn" : "ok",
      evidence: foundAds.length > 0 ? [`Annonser hittade: ${foundAds.join(", ")}`] : ["Inga uppenbara annonser"],
      tip: "Reklam kan påverka objektiviteten. Fundera på om innehållet är styrt av annonsörer."
    },
    {
      name: "E-handel",
      status: foundEcom.length > 0 ? "ok" : "unknown",
      evidence: foundEcom.length > 0 ? ["E-handelsfunktioner hittades"] : ["Ingen e-handel identifierad"],
      tip: "E-handel i sig är inte negativt, men kontrollera att butiken har tydlig avsändare och returpolicy."
    }
  ];

  // ===== SAMMANSTÄLL SCORE & TRAFIKLJUS =====
  score = Math.max(0, Math.min(100, score));

  const trafficLight = score >= 65 ? "green" as const : score >= 40 ? "yellow" as const : "red" as const;
  const riskLevel = score >= 65 ? "low" as const : score >= 40 ? "medium" as const : "high" as const;

  // Beräkna confidence baserat på hur mycket data vi hittade
  const totalSignals = greenFlags.length + redFlags.length + unknowns.length;
  const knownSignals = greenFlags.length + redFlags.length;
  const confidence = totalSignals > 0 ? Math.round((knownSignals / totalSignals) * 100) / 100 : 0.3;

  const verdict = trafficLight === "green"
    ? "Sidan verkar ha grundläggande transparens och inga tydliga varningssignaler."
    : trafficLight === "yellow"
    ? "Blandade signaler — vissa saker saknas eller är oklara. Var försiktig."
    : "Flera varningssignaler hittades. Var extra försiktig med den här sidan.";

  const simple = trafficLight === "green"
    ? "Den här sidan ser ganska okej ut! Den har kontaktinfo och verkar seriös. Men kolla alltid själv också."
    : trafficLight === "yellow"
    ? "Vi är inte helt säkra på den här sidan. En del saker saknas. Var lite försiktig och dubbelkolla."
    : "Varning! Den här sidan har saker som ser konstiga ut. Var mycket försiktig — ge aldrig ut personlig information.";

  const detailed = trafficLight === "green"
    ? `Regelbaserad analys ger ${score}/100. Grundläggande transparens finns (${greenFlags.length} positiva signaler). ${unknowns.length} saker kunde inte verifieras automatiskt.`
    : trafficLight === "yellow"
    ? `Regelbaserad analys ger ${score}/100. Blandade signaler: ${greenFlags.length} positiva, ${redFlags.length} negativa, ${unknowns.length} okända. Manuell granskning rekommenderas.`
    : `Regelbaserad analys ger ${score}/100. Flera risksignaler: ${redFlags.length} varningar hittades. Hög försiktighet rekommenderas.`;

  const checklist: ChecklistCategory[] = [
    { category: "Identitet & transparens", checks: identityChecks },
    { category: "Innehåll & källor", checks: contentChecks },
    { category: "Teknik & säkerhet", checks: techChecks },
    { category: "Integritet & datahantering", checks: privacyChecks },
    { category: "Affärsmodell & incitament", checks: businessChecks },
    { category: "Bedrägeriheuristik", checks: scamChecks }
  ];

  const keyFindings = [
    ...greenFlags.slice(0, 3).map(f => ({ signal: f, status: "good" as const, evidence: [f], whyItMatters: "Positivt tecken på transparens och seriositet." })),
    ...redFlags.slice(0, 3).map(f => ({ signal: f, status: "bad" as const, evidence: [f], whyItMatters: "Varningssignal som bör undersökas." })),
    ...unknowns.slice(0, 2).map(f => ({ signal: f, status: "unknown" as const, evidence: [f], whyItMatters: "Kunde inte verifieras automatiskt." }))
  ];

  const recommendedChecks = [
    { action: "Sök efter avsändaren", how: "Googla domännamnet eller organisationen bakom sidan.", expectedOutcome: "Du bör hitta information om vem som driver sidan." },
    { action: "Kontrollera andra källor", how: "Sök efter samma information på andra oberoende sidor.", expectedOutcome: "Trovärdig information bekräftas av flera källor." },
    { action: "Kolla domänens ålder", how: "Använd whois-tjänster (t.ex. who.is) för att se när domänen registrerades.", expectedOutcome: "Äldre domäner med historik är ofta mer trovärdiga." }
  ];

  return {
    score,
    trafficLight,
    riskLevel,
    verdict,
    audienceSummary: { simple, detailed },
    checklist,
    keyFindings,
    redFlags,
    greenFlags,
    unknowns,
    recommendedChecks,
    privacySecurity: {
      claims: privacyClaims,
      trackingIndicators,
      permissionsConcerns,
      dataHandlingRisks
    },
    scamHeuristics: {
      patternsDetected: scamPatterns,
      paymentRisk,
      impersonationRisk
    },
    confidence,
    notes: "Regelbaserad analys — kontrollerar tekniska signaler, transparens och scam-mönster i HTML. Inte lika djup som AI-analys men helt gratis och utan begränsningar."
  };
}

// --------- API handler ---------
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "För många försök. Vänta en minut och testa igen." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const inputUrl = String(body.url || "").trim();

  if (!inputUrl) return NextResponse.json({ ok: false, error: "URL saknas." }, { status: 400 });

  let url: URL;
  try {
    url = normalizeUrl(inputUrl);
    if (isPrivateIp(url.hostname)) throw new Error("Den här adressen är blockerad (SSRF-skydd).");
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Ogiltig URL.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  const checkedWhat = [
    "Validerade URL + blockerade lokala/private hosts (SSRF-skydd)",
    "Hämtade HTML och följde omdirigeringar (timeout & maxstorlek)",
    "Läste HTTP-headers och statuskod",
    "Kontrollerade HTTPS, säkerhetsheaders och omdirigeringar",
    "Sökte efter kontaktuppgifter, policy, villkor och avsändare",
    "Sökte efter datum, källor och författare",
    "Analyserade spårning och cookie-information",
    "Sökte efter scam-mönster: brådska, phishing, suspekta betalmetoder"
  ];

  try {
    const fetched = await fetchHtml(url);

    const report = analyzeRuleBased({
      url,
      finalUrl: fetched.finalUrl,
      httpStatus: fetched.httpStatus,
      headers: fetched.headers,
      html: fetched.html
    });

    return NextResponse.json({
      ok: true,
      url: url.toString(),
      finalUrl: fetched.finalUrl,
      httpStatus: fetched.httpStatus,
      checkedWhat,
      report
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Okänt fel vid analys.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
