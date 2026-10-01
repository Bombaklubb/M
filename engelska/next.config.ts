import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const STAGES = ["lagstadiet", "mellanstadiet", "hogstadiet", "gymnasiet"];
const CONTENT_FILES = ["content", "rules"];

/**
 * Hash av varje stadies content.json och rules.json. Appen hämtar filerna som
 * /content/<stadie>/content-<hash>.json (se lib/contentUrl.ts) och en rewrite
 * nedan pekar dem på den riktiga filen. Eftersom namnet byts när innehållet
 * ändras kan webbläsaren behålla filen för alltid i stället för att fråga
 * servern igen varje timme.
 */
function contentHashes(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const stage of STAGES) {
    for (const name of CONTENT_FILES) {
      const file = join(process.cwd(), "public", "content", stage, `${name}.json`);
      try {
        out[`${stage}/${name}`] = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 12);
      } catch {
        // Saknas filen används det vanliga namnet (lib/contentUrl.ts).
      }
    }
  }
  return out;
}

/**
 * Cache-regler. Vercel skickar annars filerna i public/ med
 * "max-age=0, must-revalidate", så webbläsaren frågar om varje bild vid varje
 * sidbesök – och varje fråga räknas mot teamets gemensamma tak, även när
 * svaret bara är "oförändrad".
 *
 * Ordningen spelar roll: matchar flera regler vinner den som står SIST. Regeln
 * för filer med hash i namnet ligger därför sist, så att den inte skrivs över
 * av de bredare reglerna för bilder och json.
 */
export default function config(phase: string): NextConfig {
  const dev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    env: {
      // Under utveckling används de vanliga filnamnen, så att ändrat innehåll
      // syns direkt utan omstart.
      CONTENT_HASHES: dev ? "{}" : JSON.stringify(contentHashes()),
    },
    experimental: {
      // Alla sidor är statiska skal; elevens data läses i webbläsaren när
      // sidan visas. Routern kan därför återanvända en sida den redan hämtat
      // en hel lektion, i stället för att hämta världssidan på nytt varje gång
      // eleven går tillbaka från ett kapitel. "dynamic" gäller sidor som öppnas
      // utan förhämtning – alla länkar här har prefetch={false}.
      staleTimes: { dynamic: 3600, static: 3600 },
    },
    webpack(webpackConfig, { dev: isDev, isServer }) {
      // Färre och större kodfiler i webbläsaren. Next delar annars upp koden i
      // många små filer (12 vid första besöket på startsidan), och varje fil är
      // ett eget anrop. Webpack slår ihop delarna tills varje sida laddar högst
      // så här många filer. Koden är densamma, bara uppdelad på färre filer.
      const split = webpackConfig.optimization?.splitChunks;
      if (!isDev && !isServer && split && typeof split === "object") {
        split.maxInitialRequests = 4;
        split.minSize = 60000;
      }
      return webpackConfig;
    },
    async rewrites() {
      return [
        {
          source: "/content/:stage/:name(content|rules)-:hash([0-9a-f]{12}).json",
          destination: "/content/:stage/:name.json",
        },
      ];
    },
    async headers() {
      return [
        {
          // Bilder som inte har hash i namnet: en vecka, sedan förnyas de i
          // bakgrunden medan den gamla visas.
          source: "/:all*(png|jpg|jpeg|webp|gif|svg|ico)",
          headers: [
            { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" },
          ],
        },
        {
          // Innehållsfiler som hämtas med sitt vanliga namn (t.ex. manifest).
          source: "/content/:all*(json)",
          headers: [
            { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
          ],
        },
        // ── Filer med hash i namnet: för alltid. MÅSTE stå sist. ──
        {
          source: "/sprites/:file*",
          headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
        },
        {
          source: "/content/:stage/:name(content|rules)-:hash([0-9a-f]{12}).json",
          headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
        },
      ];
    },
  };
}
