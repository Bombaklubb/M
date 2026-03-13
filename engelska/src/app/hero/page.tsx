"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import HeroAvatar from "@/components/ui/HeroAvatar";
import ItemIcon from "@/components/ui/ItemIcon";
import Image from "next/image";
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

/** Visar AI-genererad PNG om den finns, annars SVG-fallback */
function HeroAvatarImage({
  heroId, gender, skinTone, size, className,
}: {
  heroId: string; gender: Gender; skinTone: SkinTone; size: number; className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = `/images/avatars/hero/hero-${gender}-${heroId}.png`;
  if (!imgFailed) {
    return (
      <Image
        src={src}
        alt={`${gender}-${heroId}`}
        width={size}
        height={size}
        className={className}
        style={{ objectFit: "cover", borderRadius: 8 }}
        onError={() => setImgFailed(true)}
        unoptimized
      />
    );
  }
  return (
    <HeroAvatar heroId={heroId} skinTone={skinTone} gender={gender} equippedAttributes={[]} size={size} />
  );
}

const SKIN_TONES: SkinTone[] = ["light", "light_brown", "dark"];
const SKIN_PREVIEW: Record<SkinTone, string> = {
  light:       "#FDDBB4",
  light_brown: "#C58540",
  dark:        "#7B4828",
};

const HERO_GRADIENT: Record<string, { from: string; to: string; glow: string }> = {
  explorer:   { from: "#FEF3C7", to: "#FDE68A", glow: "#F59E0B" },
  scientist:  { from: "#DBEAFE", to: "#BFDBFE", glow: "#3B82F6" },
  athlete:    { from: "#DBEAFE", to: "#93C5FD", glow: "#1D4ED8" },
  footballer: { from: "#FEE2E2", to: "#FECACA", glow: "#DC2626" },
  wizard:     { from: "#EDE9FE", to: "#DDD6FE", glow: "#7C3AED" },
  inventor:   { from: "#D1FAE5", to: "#A7F3D0", glow: "#059669" },
  scholar:    { from: "#FEE2E2", to: "#FECACA", glow: "#991B1B" },
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
  const g = HERO_GRADIENT[hero.heroId] ?? HERO_GRADIENT.explorer;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          ← Tillbaka
        </Link>

        {/* Page heading */}
        <div className="mb-5">
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
            <span className="text-2xl">⚔️</span> Min hjälte
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Samla poäng för att låsa upp nya hjältar och tillbehör!
          </p>
          {student && (
            <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-full px-3 py-1 text-sm font-semibold text-amber-700 dark:text-amber-400">
              ⭐ {student.totalPoints} poäng totalt
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-5">

          {/* ── LEFT: Hero preview ─────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4 sm:w-52 flex-shrink-0">

            {/* Preview card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-4 flex flex-col items-center gap-2 w-full">
              <div
                className="rounded-2xl p-4 w-full flex justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${g.from} 0%, ${g.to} 100%)`,
                  boxShadow: `0 0 24px 4px ${g.glow}33 inset`,
                }}
              >
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ background: g.glow }} />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10" style={{ background: g.glow }} />
                <HeroAvatar
                  heroId={hero.heroId}
                  skinTone={hero.skinTone}
                  gender={gender}
                  equippedAttributes={hero.equippedAttributes}
                  size={130}
                />
              </div>
              <p className="font-black text-gray-900 dark:text-gray-100 text-base tracking-tight">
                {HERO_TYPES.find((h) => h.id === hero.heroId)?.name_sv ?? hero.heroId}
              </p>
              <p className="text-xs text-gray-400">
                {gender === "girl" ? "Flicka" : "Pojke"} · {SKIN_TONE_LABELS[hero.skinTone]}
              </p>
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
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      hero.skinTone === tone
                        ? "border-blue-500 scale-110 shadow"
                        : "border-gray-200 dark:border-gray-600 hover:scale-105"
                    }`}
                    style={{ backgroundColor: SKIN_PREVIEW[tone] }}
                  />
                ))}
              </div>
            </div>

            {/* Equipped items summary */}
            {hero.equippedAttributes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-3 w-full">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Påklädd</p>
                <div className="flex flex-wrap gap-1">
                  {hero.equippedAttributes.map((id) => {
                    const attr = HERO_ATTRIBUTES.find((a) => a.id === id);
                    return attr ? (
                      <span key={id} className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded-full border border-green-200 dark:border-green-700">
                        ✓ {attr.name_sv}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Avatar grid + items ────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-4">

            {/* 14 base avatars: 7 boys + 7 girls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Välj hjälte</p>

              {/* Boys row */}
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 font-medium">Pojkar</p>
              <div className="grid grid-cols-7 gap-1.5 mb-3">
                {HERO_TYPES.map((h) => {
                  const locked = student.totalPoints < h.unlock_points;
                  const active = hero.heroId === h.id && gender === "boy";
                  return (
                    <button
                      key={`boy-${h.id}`}
                      disabled={locked}
                      onClick={() => !locked && save({ ...hero, heroId: h.id, gender: "boy" })}
                      title={locked ? `🔒 ${h.unlock_points}p krävs` : h.name_sv}
                      className={`relative flex flex-col items-center gap-0.5 p-1.5 rounded-xl border-2 transition-all ${
                        active
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-offset-1 ring-blue-400 scale-105 shadow-md"
                          : locked
                          ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-50 cursor-not-allowed"
                          : "border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105 hover:shadow cursor-pointer"
                      }`}
                    >
                      <div className={locked ? "grayscale" : ""}>
                        <HeroAvatarImage
                          heroId={h.id}
                          skinTone={hero.skinTone}
                          gender="boy"
                          size={46}
                        />
                      </div>
                      {locked && (
                        <span className="absolute top-0.5 right-0.5 text-xs leading-none">🔒</span>
                      )}
                      {active && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Girls row */}
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 font-medium">Flickor</p>
              <div className="grid grid-cols-7 gap-1.5">
                {HERO_TYPES.map((h) => {
                  const locked = student.totalPoints < h.unlock_points;
                  const active = hero.heroId === h.id && gender === "girl";
                  return (
                    <button
                      key={`girl-${h.id}`}
                      disabled={locked}
                      onClick={() => !locked && save({ ...hero, heroId: h.id, gender: "girl" })}
                      title={locked ? `🔒 ${h.unlock_points}p krävs` : h.name_sv}
                      className={`relative flex flex-col items-center gap-0.5 p-1.5 rounded-xl border-2 transition-all ${
                        active
                          ? "border-pink-500 bg-pink-50 dark:bg-pink-900/30 ring-2 ring-offset-1 ring-pink-400 scale-105 shadow-md"
                          : locked
                          ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-50 cursor-not-allowed"
                          : "border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:scale-105 hover:shadow cursor-pointer"
                      }`}
                    >
                      <div className={locked ? "grayscale" : ""}>
                        <HeroAvatarImage
                          heroId={h.id}
                          skinTone={hero.skinTone}
                          gender="girl"
                          size={46}
                        />
                      </div>
                      {locked && (
                        <span className="absolute top-0.5 right-0.5 text-xs leading-none">🔒</span>
                      )}
                      {active && (
                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item customization */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">

              {/* Tabs */}
              <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                      activeTab === tab
                        ? "bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                  >
                    {ATTRIBUTE_TYPE_LABELS[tab]}
                  </button>
                ))}
              </div>

              {/* Item grid */}
              <div className="grid grid-cols-4 gap-2">
                {HERO_ATTRIBUTES.filter((a) => a.type === activeTab).map((attr) => {
                  const unlocked = isAttributeUnlocked(attr, student.totalPoints, hogstadietCompleted);
                  const equipped = hero.equippedAttributes.includes(attr.id);
                  return (
                    <button
                      key={attr.id}
                      disabled={!unlocked}
                      onClick={() => unlocked && toggleAttribute(attr.id, activeTab)}
                      className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-center transition-all ${
                        equipped
                          ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-sm"
                          : unlocked
                          ? "border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 cursor-pointer hover:scale-105"
                          : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {/* Item illustration */}
                      <div className="relative">
                        <ItemIcon itemId={attr.id} size={44} />
                        {/* Lock overlay */}
                        {!unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-900/20 dark:bg-gray-900/40">
                            <span className="text-lg">🔒</span>
                          </div>
                        )}
                        {/* Equipped check */}
                        {equipped && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow">
                            <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Item name */}
                      <span className={`text-xs font-medium leading-tight ${
                        equipped
                          ? "text-green-700 dark:text-green-400"
                          : unlocked
                          ? "text-gray-700 dark:text-gray-200"
                          : "text-gray-400"
                      }`}>
                        {attr.name_sv}
                      </span>

                      {/* Unlock cost */}
                      {!unlocked && (
                        <span className="text-xs text-gray-400">
                          {attr.unlock_condition ? "Spel." : `${attr.unlock_points}p`}
                        </span>
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
