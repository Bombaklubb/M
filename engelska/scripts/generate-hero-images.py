#!/usr/bin/env python3
"""
Generera AI-bilder för hjältesystemet i Engelskajakten.

Kör lokalt med:
    export GOOGLE_API_KEY="AIzaSyD6aBCQk-JLujonDhVMq0XuvbJpvskoimM"
    python3 engelska/scripts/generate-hero-images.py

Bilder sparas i:
    engelska/public/images/avatars/hero/   (14 PNG-filer)
    engelska/public/images/items/          (32 PNG-filer)
"""

import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────

MODEL = "gemini-2.0-flash-preview-image-generation"
SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR   = SCRIPT_DIR.parent
AVATAR_DIR = ROOT_DIR / "public" / "images" / "avatars" / "hero"
ITEM_DIR   = ROOT_DIR / "public" / "images" / "items"

AVATAR_STYLE = (
    "Children's educational app cartoon style. "
    "Thick black outlines (2-3px). Soft cel-shading with clean color fills. "
    "Large expressive eyes with white highlight dots. "
    "Bright, friendly colors. Simple and clean design. "
    "White or transparent background. "
    "Square image, portrait crop showing head, shoulders and upper chest. "
    "Consistent chibi-like proportions. "
    "No text or labels in the image."
)

ITEM_STYLE = (
    "Children's educational app cartoon icon style. "
    "Thick black outlines. Soft cel-shading. Bright saturated colors. "
    "Isolated item on transparent or white background. "
    "Square icon format. Simple and recognizable. "
    "No text or labels in the image."
)

# ── Avatarer ─────────────────────────────────────────────────────────────────

AVATARS = [
    ("hero-boy-explorer",   "Cartoon boy character. Sandy light-brown short hair. Light skin. Friendly smile. White t-shirt. Looking forward. " + AVATAR_STYLE),
    ("hero-boy-scientist",  "Cartoon boy character. Dark brown neat short hair. Light-medium skin. Curious expression. White t-shirt. " + AVATAR_STYLE),
    ("hero-boy-athlete",    "Cartoon boy character. Black short spiky hair. Dark brown skin. Energetic smile. White t-shirt. " + AVATAR_STYLE),
    ("hero-boy-footballer", "Cartoon boy character. Golden blonde short hair. Light skin. Confident smile. White t-shirt. " + AVATAR_STYLE),
    ("hero-boy-wizard",     "Cartoon boy character. Dark medium-length hair. Medium brown skin. Mysterious smile. White t-shirt. " + AVATAR_STYLE),
    ("hero-boy-inventor",   "Cartoon boy character. Red auburn short messy hair. Light skin. Excited grin. White t-shirt. " + AVATAR_STYLE),
    ("hero-boy-scholar",    "Cartoon boy character. Black straight short hair. Dark skin. Wise gentle smile. White t-shirt. " + AVATAR_STYLE),

    ("hero-girl-explorer",   "Cartoon girl character. Blonde pigtails. Light skin. Adventurous smile. White t-shirt. " + AVATAR_STYLE),
    ("hero-girl-scientist",  "Cartoon girl character. Dark brown hair in neat bun. Light-medium skin. Smart expression. White t-shirt. " + AVATAR_STYLE),
    ("hero-girl-athlete",    "Cartoon girl character. Black hair in high ponytail. Dark brown skin. Athletic energetic smile. White t-shirt. " + AVATAR_STYLE),
    ("hero-girl-footballer", "Cartoon girl character. Auburn red long straight hair. Light skin. Sporty confident smile. White t-shirt. " + AVATAR_STYLE),
    ("hero-girl-wizard",     "Cartoon girl character. Dark long wavy hair. Medium brown skin. Magical mysterious smile. White t-shirt. " + AVATAR_STYLE),
    ("hero-girl-inventor",   "Cartoon girl character. Ginger red hair in two braids. Light skin. Creative excited smile. White t-shirt. " + AVATAR_STYLE),
    ("hero-girl-scholar",    "Cartoon girl character. Black straight hair with blunt bangs. Dark skin. Intelligent calm smile. White t-shirt. " + AVATAR_STYLE),
]

# ── Föremål ───────────────────────────────────────────────────────────────────

ITEMS = [
    # Hattar
    ("hat-headband",    "Red sports headband. Cartoon icon. Simple red fabric band with small decoration in center. " + ITEM_STYLE),
    ("hat-explorer",    "Tan explorer safari hat with wide brim. Small green leaf tucked in band. Cartoon icon. " + ITEM_STYLE),
    ("hat-cap",         "Blue baseball cap with curved brim and small button on top. Cartoon icon. " + ITEM_STYLE),
    ("hat-santa",       "Red Santa Claus hat with white fluffy trim at base and white pompom at tip. Cartoon icon. " + ITEM_STYLE),
    ("hat-cowboy",      "Brown cowboy hat with wide brim and dark hatband. Cartoon icon. " + ITEM_STYLE),
    ("hat-wizard",      "Tall purple wizard hat with wide brim. Yellow stars and moons decoration. Cartoon icon. " + ITEM_STYLE),
    ("hat-graduation",  "Black graduation mortarboard cap with flat square top and yellow tassel hanging to the side. Cartoon icon. " + ITEM_STYLE),
    ("hat-crown",       "Gold royal crown with zigzag points. Red gem in center, blue gems on sides. Cartoon icon. " + ITEM_STYLE),

    # Tröjor
    ("shirt-hoodie",   "Gray hoodie sweatshirt with hood and front pocket. Cartoon icon. " + ITEM_STYLE),
    ("shirt-jacket",   "Brown explorer jacket with chest pockets and lapels. Cartoon icon. " + ITEM_STYLE),
    ("shirt-labcoat",  "White lab coat with lapels and breast pocket. Cartoon icon. " + ITEM_STYLE),
    ("shirt-sport",    "Green sports jersey with white number 10 on front. Cartoon icon. " + ITEM_STYLE),
    ("shirt-armor",    "Silver chainmail armor shirt with metal plates. Cartoon icon. " + ITEM_STYLE),
    ("shirt-suit",     "Black tuxedo jacket with white shirt and red bow tie. Cartoon icon. " + ITEM_STYLE),
    ("shirt-robe",     "Purple academic graduation robe with wide sleeves and white collar trim. Cartoon icon. " + ITEM_STYLE),
    ("shirt-cape",     "Red superhero cape with gold star symbol in center. Cartoon icon. " + ITEM_STYLE),

    # Tillbehör
    ("acc-glasses",    "Round blue-tinted glasses with thin dark frames. Cartoon icon. " + ITEM_STYLE),
    ("acc-backpack",   "Brown adventure backpack with colorful patches and multiple pockets. Cartoon icon. " + ITEM_STYLE),
    ("acc-book",       "Purple magic book with golden star on cover and glowing edges. Cartoon icon. " + ITEM_STYLE),
    ("acc-compass",    "Gold compass with N S E W markings and red needle pointing north. Cartoon icon. " + ITEM_STYLE),
    ("acc-medal",      "Gold medal hanging on red ribbon. Star pattern engraved on medal face. Cartoon icon. " + ITEM_STYLE),
    ("acc-trophy",     "Gold trophy cup with handles and star on base. Cartoon icon. " + ITEM_STYLE),
    ("acc-wand",       "Purple magic wand with yellow star tip surrounded by sparkles. Cartoon icon. " + ITEM_STYLE),
    ("acc-magnifying", "Magnifying glass with round blue-tinted lens and dark handle. Cartoon icon. " + ITEM_STYLE),

    # Effekter
    ("effect-starglow",   "Golden star burst glow effect. Bright yellow star with radiating light rays on transparent background. Cartoon icon. " + ITEM_STYLE),
    ("effect-sparkles",   "Colorful sparkle aura effect. Mix of gold purple and blue sparkle stars scattered in circular pattern. Cartoon icon. " + ITEM_STYLE),
    ("effect-swirl",      "Purple magic swirl spiral effect. Glowing purple spiral with small sparkles. Cartoon icon. " + ITEM_STYLE),
    ("effect-energyring", "Orange and gold energy ring halo effect. Glowing circular ring with energy particles. Cartoon icon. " + ITEM_STYLE),
    ("effect-goldaura",   "Golden radiant aura effect. Warm golden glow with light rays emanating outward. Cartoon icon. " + ITEM_STYLE),
    ("effect-lightbeam",  "Yellow white light beam effect. Vertical cone of light shining downward with glowing top. Cartoon icon. " + ITEM_STYLE),
    ("effect-fire",       "Orange red fire trail flames effect. Upward flames with yellow tips on transparent background. Cartoon icon. " + ITEM_STYLE),
    ("effect-dust",       "Colorful sparkle dust particles effect. Small pink yellow blue green dots scattered on transparent background. Cartoon icon. " + ITEM_STYLE),
]

# ── API-anrop ─────────────────────────────────────────────────────────────────

def get_api_key() -> str:
    key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not key:
        print("FEL: Sätt GOOGLE_API_KEY i miljön.")
        print("  export GOOGLE_API_KEY='din-nyckel'")
        sys.exit(1)
    return key


def generate_image(api_key: str, prompt: str, output_path: Path, retries: int = 3) -> bool:
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{MODEL}:generateContent?key={api_key}"
    )
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["image", "text"]},
    }).encode("utf-8")

    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(
                url, data=payload,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read().decode("utf-8"))

            for candidate in data.get("candidates", []):
                for part in candidate.get("content", {}).get("parts", []):
                    if "inlineData" in part:
                        output_path.parent.mkdir(parents=True, exist_ok=True)
                        output_path.write_bytes(base64.b64decode(part["inlineData"]["data"]))
                        return True
                    if "text" in part and part["text"]:
                        print(f"  Modelltext: {part['text'][:120]}")

            print(f"  Inget bilddata i svar (försök {attempt}/{retries})")

        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8")[:300]
            print(f"  HTTP {e.code} (försök {attempt}/{retries}): {body}")
        except urllib.error.URLError as e:
            print(f"  Nätverksfel (försök {attempt}/{retries}): {e.reason}")
        except Exception as e:
            print(f"  Oväntat fel (försök {attempt}/{retries}): {e}")

        if attempt < retries:
            wait = 2 ** attempt
            print(f"  Väntar {wait}s...")
            time.sleep(wait)

    return False


# ── Huvud ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generera hjältebilder för Engelskajakten")
    parser.add_argument("--only", choices=["avatars", "items"], help="Generera bara avatarer eller föremål")
    parser.add_argument("--skip-existing", action="store_true", default=True, help="Hoppa över redan genererade bilder (standard)")
    parser.add_argument("--force", action="store_true", help="Generera om alla bilder, även befintliga")
    args = parser.parse_args()

    skip = not args.force
    api_key = get_api_key()

    tasks: list[tuple[str, Path]] = []

    if args.only != "items":
        for name, prompt in AVATARS:
            tasks.append((prompt, AVATAR_DIR / f"{name}.png"))

    if args.only != "avatars":
        for name, prompt in ITEMS:
            tasks.append((prompt, ITEM_DIR / f"{name}.png"))

    total  = len(tasks)
    done   = 0
    failed = []

    print(f"\n{'='*60}")
    print(f"  Engelskajakten – Bildgenerering")
    print(f"  {total} bilder att generera")
    if skip:
        already = sum(1 for _, p in tasks if p.exists())
        print(f"  {already} finns redan (--force för att generera om)")
    print(f"{'='*60}\n")

    for i, (prompt, path) in enumerate(tasks, 1):
        name = path.stem
        if skip and path.exists():
            print(f"[{i:2}/{total}] ✓ (hoppar) {name}")
            done += 1
            continue

        print(f"[{i:2}/{total}] Genererar {name}...")
        success = generate_image(api_key, prompt, path)

        if success:
            size_kb = path.stat().st_size // 1024
            print(f"[{i:2}/{total}] ✓ {name} ({size_kb} KB)")
            done += 1
        else:
            print(f"[{i:2}/{total}] ✗ MISSLYCKADES: {name}")
            failed.append(name)

        # Paus mellan anrop för att undvika rate limiting
        if i < total:
            time.sleep(1.5)

    print(f"\n{'='*60}")
    print(f"  Klart: {done}/{total} bilder")
    if failed:
        print(f"  Misslyckades ({len(failed)}):")
        for f in failed:
            print(f"    - {f}")
        print(f"\n  Försök igen med: python3 scripts/generate-hero-images.py")
    else:
        print("  Alla bilder genererades!")
    print(f"{'='*60}\n")

    sys.exit(0 if not failed else 1)


if __name__ == "__main__":
    main()
