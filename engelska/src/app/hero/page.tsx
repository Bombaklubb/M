"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import HeroAvatar from "@/components/ui/HeroAvatar";
import { loadStudent, saveStudent } from "@/lib/storage";
import {
  HERO_TYPES,
  HERO_ATTRIBUTES,
  SKIN_TONE_LABELS,
  ATTRIBUTE_TYPE_LABELS,
  isAttributeUnlocked,
  type HeroAttribute,
} from "@/lib/heroData";
import type { StudentData, SkinTone, HeroConfig } from "@/lib/types";

type AttrTab = HeroAttribute["type"];
type Gender = "boy" | "girl";

const SKIN_TONES: SkinTone[] = ["light", "light_brown", "dark"];
const SKIN_PREVIEW: Record<SkinTone, string> = {
  light:       "#FDDBB4",
  light_brown: "#C58540",
  dark:        "#7B4828",
};

const ATTR_ICONS: Record<string, string> = {
  // hats
  headband:       "🎀",
  explorer_hat:   "🎩",
  beanie:         "🧶",
  cap:            "🧢",
  santa_hat:      "🎅",
  cowboy_hat:     "🤠",
  wizard_hat:     "🔮",
  top_hat:        "🎩",
  crown:          "👑",
  viking_helmet:  "⚔️",
  graduation_cap: "🎓",
  // shirts
  tshirt:          "⭐",
  hoodie:          "👕",
  striped_shirt:   "👔",
  lab_coat:        "🥼",
  sport_jersey:    "🏅",
  cape:            "🦸",
  explorer_jacket: "🧥",
  winter_jacket:   "🧣",
  armor_shirt:     "🛡️",
  tuxedo:          "🤵",
  // accessories
  pencil:       "✏️",
  backpack:     "🎒",
  glasses:      "👓",
  football_ball:"⚽",
  compass:      "🧭",
  camera:       "📷",
  sword:        "⚔️",
  book:         "📚",
  guitar:       "🎸",
  magic_wand:   "🪄",
  telescope:    "🔭",
  trophy:       "🏆",
  // effects
  flower_wreath: "🌸",
  rainbow_trail: "🌈",
  sparkles:      "✨",
  fire_aura:     "🔥",
  ice_aura:      "❄️",
  star_glow:     "⭐",
  cloud_halo:    "☁️",
  lightning:     "⚡",
  shadow_clone:  "👥",
  golden_shine:  "🌟",
};

export default function HeroPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [hero, setHero] = useState<HeroConfig>({
    heroId: "explorer",
    skinTone: "light",
    gender: "boy",
    equippedAttributes: [],
  });
  const [activeTab, setActiveTab] = useState<AttrTab>("hat");

  useEffect(() => {
    const s = loadStudent();
    if (!s) { router.push("/"); return; }
    setStudent(s);
    if (s.hero) setHero({ gender: "boy", ...s.hero });
  }, [router]);

  function save(updated: HeroConfig) {
    setHero(updated);
    const s = loadStudent();
    if (!s) return;
    s.hero = updated;
    saveStudent(s);
    setStudent({ ...s });
  }

  function toggleAttribute(attrId: string, type: AttrTab) {
    const isEquipped = hero.equippedAttributes.includes(attrId);
    let next: string[];
    if (isEquipped) {
      next = hero.equippedAttributes.filter((a) => a !== attrId);
    } else {
      const sameType = HERO_ATTRIBUTES.filter((a) => a.type === type).map((a) => a.id);
      next = hero.equippedAttributes.filter((a) => !sameType.includes(a));
      next.push(attrId);
    }
    save({ ...hero, equippedAttributes: next });
  }

  const hogstadietCompleted = student
    ? Object.values(student.stages?.hogstadiet?.grammarModules ?? {}).filter((m) => m.completed).length
    : 0;

  const tabs: AttrTab[] = ["hat", "shirt", "accessory", "effect"];

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce-slow">⚔️</div>
      </div>
    );
  }

  const gender: Gender = hero.gender ?? "boy";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          ← Tillbaka
        </Link>

        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1">⚔️ Min hjälte</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Samla poäng för att låsa upp nya hjältar och tillbehör!
        </p>

        <div className="flex flex-col sm:flex-row gap-6">

          {/* ── Left: preview + skin + gender ── */}
          <div className="flex flex-col items-center gap-4 sm:w-48 flex-shrink-0">

            {/* Hero preview */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-4 flex flex-col items-center gap-2 w-full">
              <div className="bg-gradient-to-b from-sky-100 to-sky-50 dark:from-sky-900/30 dark:to-sky-800/20 rounded-2xl p-4 w-full flex justify-center">
                <HeroAvatar
                  heroId={hero.heroId}
                  skinTone={hero.skinTone}
                  gender={gender}
                  equippedAttributes={hero.equippedAttributes}
                  size={120}
                />
              </div>
              <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                {HERO_TYPES.find((h) => h.id === hero.heroId)?.name_sv ?? hero.heroId}
              </p>
              <p className="text-xs text-gray-400">
                {gender === "girl" ? "Flicka" : "Pojke"} · {SKIN_TONE_LABELS[hero.skinTone]}
              </p>
            </div>

            {/* Gender selector */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-3 w-full">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Kön</p>
              <div className="flex gap-2">
                {(["boy", "girl"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => save({ ...hero, gender: g })}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all ${
                      gender === g
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                        : "border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700"
                    }`}
                  >
                    <span className="text-xl">{g === "boy" ? "👦" : "👧"}</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      {g === "boy" ? "Pojke" : "Flicka"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skin tone */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-3 w-full">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Hudton</p>
              <div className="flex gap-2 justify-center">
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => save({ ...hero, skinTone: tone })}
                    title={SKIN_TONE_LABELS[tone]}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      hero.skinTone === tone
                        ? "border-blue-500 scale-110 shadow"
                        : "border-gray-200 dark:border-gray-600 hover:scale-105"
                    }`}
                    style={{ backgroundColor: SKIN_PREVIEW[tone] }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: hero type + attributes ── */}
          <div className="flex-1 flex flex-col gap-4">

            {/* Hero type */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Välj hjälte</p>
              <div className="grid grid-cols-4 gap-2">
                {HERO_TYPES.map((h) => {
                  const locked = student.totalPoints < h.unlock_points;
                  const active = hero.heroId === h.id;
                  return (
                    <button
                      key={h.id}
                      disabled={locked}
                      onClick={() => !locked && save({ ...hero, heroId: h.id })}
                      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl border-2 transition-all ${
                        active
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : locked
                          ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-55 cursor-not-allowed"
                          : "border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/50 cursor-pointer"
                      }`}
                    >
                      <div className="w-10 h-14 flex items-center justify-center">
                        <HeroAvatar heroId={h.id} skinTone={hero.skinTone} gender={gender} equippedAttributes={[]} size={36} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight">
                        {h.name_sv}
                      </span>
                      {locked
                        ? <span className="text-xs text-gray-400">🔒{h.unlock_points}p</span>
                        : active
                        ? <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">✓</span>
                        : null
                      }
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Attributes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                      activeTab === tab
                        ? "bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {ATTRIBUTE_TYPE_LABELS[tab]}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 xs:grid-cols-5 gap-2">
                {HERO_ATTRIBUTES.filter((a) => a.type === activeTab).map((attr) => {
                  const unlocked = isAttributeUnlocked(attr, student.totalPoints, hogstadietCompleted);
                  const equipped = hero.equippedAttributes.includes(attr.id);
                  return (
                    <button
                      key={attr.id}
                      disabled={!unlocked}
                      onClick={() => unlocked && toggleAttribute(attr.id, activeTab)}
                      className={`flex flex-col items-center gap-0.5 p-2 rounded-xl border-2 text-center transition-all ${
                        equipped
                          ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                          : unlocked
                          ? "border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/50 cursor-pointer"
                          : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-lg">{ATTR_ICONS[attr.id] ?? "❓"}</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-tight">
                        {attr.name_sv}
                      </span>
                      {!unlocked && (
                        <span className="text-xs text-gray-400">
                          🔒{attr.unlock_condition ? "Spel." : `${attr.unlock_points}p`}
                        </span>
                      )}
                      {equipped && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-bold">På!</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
