"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import { useDarkMode } from "@/lib/useDarkMode";
import {
  loadStudent,
  saveStudent,
  loadGamification,
  saveGamification,
} from "@/lib/storage";
import {
  CHEST_META,
  ALL_BADGES,
  BOSS_UNLOCK_THRESHOLD,
  BOSS_CONFIGS,
  getBadge,
  openWoodChest,
  openSilverChest,
  openGoldChest,
  openRubyChest,
  openDiamondChest,
  openEmeraldChest,
  openHemligChest,
  BADGE_HOW_TO_EARN,
} from "@/lib/gamification";
import type { BossId } from "@/lib/gamification";
import type { StudentData, GamificationData, Chest, ChestType } from "@/lib/types";

const BG_LIGHT = "linear-gradient(160deg, #0a1744 0%, #0e2882 30%, #1242a0 55%, #0d246b 80%, #0a1744 100%)";
const BG_DARK  = "linear-gradient(160deg, #020810 0%, #040d22 30%, #081535 55%, #040b1c 80%, #020810 100%)";

// ─── Chest sprite image ───────────────────────────────────────────────────────

function ChestImage({ type, className, open }: { type: ChestType; className?: string; open?: boolean }) {
  const meta = CHEST_META[type];
  return (
    <img
      src={open ? meta.openImage : meta.image}
      alt={meta.label}
      className={`object-contain ${className ?? ""}`}
    />
  );
}

// ─── Chest Card (unopened) ────────────────────────────────────────────────────

function ChestCard({ chest, onOpen }: { chest: Chest; onOpen: (id: string) => void }) {
  const meta = CHEST_META[chest.type];
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    if (chest.opened || animating) return;
    setAnimating(true);
    setTimeout(() => { onOpen(chest.id); setAnimating(false); }, 500);
  }

  const glows: Record<ChestType, string> = {
    wood:    "rgba(146,64,14,0.5)",
    silver:  "rgba(100,116,139,0.5)",
    gold:    "rgba(245,158,11,0.6)",
    ruby:    "rgba(220,38,38,0.6)",
    diamond: "rgba(56,189,248,0.6)",
    emerald: "rgba(16,185,129,0.6)",
    hemlig:  "rgba(147,51,234,0.7)",
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col items-center p-3 rounded-2xl cursor-pointer select-none"
      style={{
        background: "rgba(0,0,0,0.3)",
        border: "2px solid rgba(255,255,255,0.15)",
        boxShadow: `0 6px 24px ${glows[chest.type]}, inset 0 1px 0 rgba(255,255,255,0.15)`,
        transform: animating ? "scale(1.08) rotate(-3deg)" : "scale(1)",
        transition: "transform 0.15s ease-out, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => { if (!animating) e.currentTarget.style.transform = "scale(1.04) translateY(-2px)"; }}
      onMouseLeave={(e) => { if (!animating) e.currentTarget.style.transform = "scale(1)"; }}
    >
      <div style={{ animation: animating ? "shake 0.4s ease-in-out" : "none" }}>
        <ChestImage type={chest.type} className="w-16 h-12 mb-1" />
      </div>
      <span className="text-[10px] font-bold text-white/90">{meta.label}</span>
      <span className="text-[9px] text-white/50 mt-0.5">Tryck för att öppna</span>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg) scale(1.05); }
          40% { transform: rotate(8deg) scale(1.1); }
          60% { transform: rotate(-5deg) scale(1.05); }
          80% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Trophy Shelf ─────────────────────────────────────────────────────────────

const SHELF_CONFIGS: { type: ChestType; label: string; shelfColor: string; itemGlow: string; itemBg: string; badge: string }[] = [
  {
    type: "hemlig",
    label: "Hemliga kistor",
    shelfColor: "linear-gradient(90deg, #3b0764, #7e22ce 30%, #c084fc 50%, #7e22ce 70%, #3b0764)",
    itemBg: "linear-gradient(135deg, #3b0764, #4c1d95)",
    itemGlow: "rgba(192,132,252,0.6)",
    badge: "#c084fc",
  },
  {
    type: "emerald",
    label: "Smaragdkistor",
    shelfColor: "linear-gradient(90deg, #064e3b, #059669 30%, #34d399 50%, #059669 70%, #064e3b)",
    itemBg: "linear-gradient(135deg, #064e3b, #065f46)",
    itemGlow: "rgba(52,211,153,0.5)",
    badge: "#34d399",
  },
  {
    type: "diamond",
    label: "Diamantkistor",
    shelfColor: "linear-gradient(90deg, #0c4a6e, #0284c7 30%, #7dd3fc 50%, #0284c7 70%, #0c4a6e)",
    itemBg: "linear-gradient(135deg, #0c4a6e, #075985)",
    itemGlow: "rgba(125,211,252,0.5)",
    badge: "#7dd3fc",
  },
  {
    type: "ruby",
    label: "Rubinkistor",
    shelfColor: "linear-gradient(90deg, #7f1d1d, #dc2626 30%, #fca5a5 50%, #dc2626 70%, #7f1d1d)",
    itemBg: "linear-gradient(135deg, #7f1d1d, #991b1b)",
    itemGlow: "rgba(252,165,165,0.5)",
    badge: "#fca5a5",
  },
  {
    type: "gold",
    label: "Guldkistor",
    shelfColor: "linear-gradient(90deg, #78350f, #d97706 30%, #fbbf24 50%, #d97706 70%, #78350f)",
    itemBg: "linear-gradient(135deg, #451a03, #78350f)",
    itemGlow: "rgba(251,191,36,0.5)",
    badge: "#fbbf24",
  },
  {
    type: "silver",
    label: "Silverkistor",
    shelfColor: "linear-gradient(90deg, #1e293b, #64748b 30%, #cbd5e1 50%, #64748b 70%, #1e293b)",
    itemBg: "linear-gradient(135deg, #1e293b, #475569)",
    itemGlow: "rgba(203,213,225,0.4)",
    badge: "#cbd5e1",
  },
  {
    type: "wood",
    label: "Bronslådor",
    shelfColor: "linear-gradient(90deg, #431407, #92400e 30%, #c2652a 50%, #92400e 70%, #431407)",
    itemBg: "linear-gradient(135deg, #431407, #7c2d12)",
    itemGlow: "rgba(194,101,42,0.4)",
    badge: "#fdba74",
  },
];

function TrofHylla({ chests }: { chests: Chest[] }) {
  const opened = chests.filter((c) => c.opened);
  const totalByType = (t: ChestType) => opened.filter((c) => c.type === t).length;

  if (opened.length === 0) {
    return (
      <section>
        <SectionTitle emoji="🪵" title="Trofhylla" subtitle="Din samling av öppnade kistor" />
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #1c0d00, #2d1a00)",
            border: "2px solid rgba(146,64,14,0.4)",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          <div className="text-5xl mb-3 opacity-40">🪵</div>
          <p className="text-amber-300/60 text-sm font-medium">Hyllan är tom</p>
          <p className="text-white/30 text-xs mt-1">Öppna kistor och fyll hyllan med troféer!</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionTitle emoji="🪵" title="Trofhylla" subtitle="Din samling av öppnade kistor" />

      {/* Stats bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["hemlig", "emerald", "diamond", "ruby", "gold", "silver", "wood"] as ChestType[]).map((type) => {
          const count = totalByType(type);
          if (count === 0) return null;
          const colors: Record<ChestType, string> = {
            hemlig: "#c084fc", emerald: "#34d399", diamond: "#7dd3fc", ruby: "#fca5a5",
            gold: "#fbbf24", silver: "#cbd5e1", wood: "#fdba74",
          };
          return (
            <div
              key={type}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ChestImage type={type} className="w-5 h-4" />
              <span className="text-sm font-bold" style={{ color: colors[type] }}>{count}</span>
            </div>
          );
        })}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl ml-auto"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <span className="text-white/50 text-xs">Totalt</span>
          <span className="text-white font-bold text-sm">{opened.length}</span>
        </div>
      </div>

      {/* The shelf unit */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1c0d00 0%, #2d1800 100%)",
          border: "2px solid rgba(146,64,14,0.5)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {SHELF_CONFIGS.filter((sc) => totalByType(sc.type) > 0).map((sc, idx, arr) => {
          const items = opened.filter((c) => c.type === sc.type);
          return (
            <div key={sc.type}>
              {/* Shelf level */}
              <div className="px-4 pt-4 pb-0">
                {/* Label */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: sc.badge }}>
                    {sc.label}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.08)", color: sc.badge }}
                  >
                    {items.length}
                  </span>
                </div>

                {/* Chest items */}
                <div className="flex flex-wrap gap-2 pb-4">
                  {items.map((chest) => (
                    <ShelfChest key={chest.id} chest={chest} bg={sc.itemBg} glow={sc.itemGlow} badge={sc.badge} />
                  ))}
                </div>
              </div>

              {/* Shelf plank */}
              <div
                className="h-3"
                style={{
                  background: sc.shelfColor,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              />

              {/* Gap between shelves (not after last) */}
              {idx < arr.length - 1 && <div className="h-1" style={{ background: "rgba(0,0,0,0.3)" }} />}
            </div>
          );
        })}

        {/* Bottom base of shelf unit */}
        <div className="h-3" style={{ background: "linear-gradient(90deg, #431407, #78350f 30%, #92400e 50%, #78350f 70%, #431407)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)" }} />
      </div>
    </section>
  );
}

function ShelfChest({ chest, bg, glow, badge }: { chest: Chest; bg: string; glow: string; badge: string }) {
  const meta = CHEST_META[chest.type];
  const date = new Date(chest.earnedAt).toLocaleDateString("sv-SE", { month: "short", day: "numeric" });
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center px-2.5 pt-2.5 pb-2 rounded-xl cursor-default transition-all duration-200"
      style={{
        background: bg,
        border: `1px solid rgba(255,255,255,0.12)`,
        boxShadow: hover ? `0 0 16px ${glow}, 0 4px 12px rgba(0,0,0,0.4)` : `0 2px 6px rgba(0,0,0,0.3)`,
        transform: hover ? "translateY(-3px) scale(1.05)" : "scale(1)",
        minWidth: "56px",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={chest.openedReward ?? meta.label}
    >
      <ChestImage type={chest.type} className="w-10 h-8 mb-1" open />
      <span className="text-[9px] font-bold" style={{ color: badge }}>{date}</span>
      {/* Shine line */}
      <div className="absolute top-1.5 left-2.5 right-2.5 h-px bg-white/15 rounded-full" />
    </div>
  );
}

// ─── Reward Popup ─────────────────────────────────────────────────────────────

interface RewardResult { description: string; points: number }

function RewardPopup({ result, onClose }: { result: RewardResult; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-3xl p-7 max-w-sm w-full text-center animate-slide-up"
        style={{
          background: "rgba(255,255,255,0.97)",
          border: "3px solid #f59e0b",
          boxShadow: "0 12px 40px rgba(245,158,11,0.4), 0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <div className="text-5xl mb-4" style={{ animation: "popIn 0.4s cubic-bezier(0.36,0.07,0.19,0.97)" }}>🎉</div>
        <h2 className="text-xl font-black text-amber-700 mb-2">Kistan är öppnad!</h2>
        <p className="text-sm font-semibold text-gray-700 mb-5 leading-relaxed">{result.description}</p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-white text-sm cursor-pointer transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 4px 12px rgba(217,119,6,0.4)" }}
        >
          Toppen! ✓
        </button>
        <style jsx>{`
          @keyframes popIn {
            0% { transform: scale(0.3); opacity: 0; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="w-9 h-9 flex items-center justify-center rounded-xl text-lg flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        {emoji}
      </span>
      <div>
        <h2 className="text-base font-black text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-white/40 text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function KistorPage() {
  const router = useRouter();
  const { dark } = useDarkMode();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [gam, setGam] = useState<GamificationData | null>(null);
  const [rewardResult, setRewardResult] = useState<RewardResult | null>(null);

  useEffect(() => {
    const s = loadStudent();
    if (!s) { router.push("/"); return; }
    setStudent(s);
    setGam(loadGamification());
  }, []);

  if (!student || !gam) return null;

  const bg = dark ? BG_DARK : BG_LIGHT;
  const unopened = gam.chests.filter((c) => !c.opened);
  const exercisesLeft = Math.max(0, BOSS_UNLOCK_THRESHOLD - gam.exercisesCompleted);

  function handleOpenChest(chestId: string) {
    if (!gam || !student) return;
    const chest = gam.chests.find((c) => c.id === chestId);
    if (!chest || chest.opened) return;

    let result: { points: number; badge?: string; bonusChest?: Chest; description: string };
    if (chest.type === "wood")         result = { ...openWoodChest(), badge: undefined, bonusChest: undefined };
    else if (chest.type === "silver")  result = openSilverChest(gam.badges);
    else if (chest.type === "gold")    result = openGoldChest(gam.badges);
    else if (chest.type === "ruby")    result = openRubyChest(gam.badges);
    else if (chest.type === "diamond") result = openDiamondChest(gam.badges);
    else if (chest.type === "emerald") result = openEmeraldChest(gam.badges);
    else                               result = openHemligChest(gam.badges);

    const newChests = gam.chests.map((c) =>
      c.id === chestId ? { ...c, opened: true, openedReward: result.description } : c
    );
    const newBadges = result.badge && !gam.badges.includes(result.badge)
      ? [...gam.badges, result.badge]
      : gam.badges;
    if (result.bonusChest) newChests.push(result.bonusChest);

    const newGam = { ...gam, chests: newChests, badges: newBadges };
    saveGamification(newGam);
    setGam({ ...newGam });

    const updatedStudent = { ...student, totalPoints: student.totalPoints + result.points };
    saveStudent(updatedStudent);
    setStudent(updatedStudent);

    setRewardResult({ description: result.description, points: result.points });
  }

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <Header student={student} />

      {/* Page header */}
      <div className="max-w-3xl mx-auto px-4 pt-5 pb-2">
        <Link href="/" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs mb-4 transition-colors">
          ← Tillbaka
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #92400e, #d97706)", boxShadow: "0 0 24px rgba(217,119,6,0.4)" }}
          >
            <ChestImage type="gold" className="w-11 h-9" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Hemliga Kistor</h1>
            <p className="text-white/50 text-xs">Öppna kistor och bygg din trofhylla</p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 pb-10 space-y-8">

        {/* ─── Boss challenges ── */}
        <section>
          <SectionTitle emoji="⚔️" title="Boss Challenges" subtitle="Besegra bossarna för speciella belöningar" />

          {!gam.bossUnlocked ? (
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <span className="text-3xl">🔒</span>
              <div className="flex-1">
                <p className="text-sm font-black text-white">Boss Challenge</p>
                <p className="text-white/60 text-xs">
                  Slutför {exercisesLeft} övning{exercisesLeft !== 1 ? "ar" : ""} till för att låsa upp
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div
                      className="h-full bg-white/50 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (gam.exercisesCompleted / BOSS_UNLOCK_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                  <span className="text-white/40 text-xs">{gam.exercisesCompleted}/{BOSS_UNLOCK_THRESHOLD}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {(["dragon", "troll", "wizard"] as BossId[]).map((bossId) => {
                const boss = BOSS_CONFIGS[bossId];
                const beaten = (gam.bossesBeaten ?? []).includes(bossId);
                return (
                  <div
                    key={bossId}
                    className="rounded-2xl p-4"
                    style={{
                      background: boss.gradient,
                      border: "1px solid rgba(255,255,255,0.15)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{boss.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-sm font-black text-white">{boss.name}</h2>
                            {beaten && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white/90">
                                ✓ Besegrad
                              </span>
                            )}
                          </div>
                          <p className="text-white/60 text-xs">{boss.subtitle} · Belöning: {CHEST_META[boss.rewardChestType].label}</p>
                        </div>
                      </div>
                      <Link
                        href={`/boss?type=${bossId}`}
                        className="px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all active:scale-95 flex-shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          color: boss.accentColor,
                          border: "1px solid rgba(255,255,255,0.5)",
                        }}
                      >
                        Utmana ⚔️
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── Unopened chests ── */}
        <section>
          <SectionTitle
            emoji="🎁"
            title={`Oöppnade kistor${unopened.length > 0 ? ` (${unopened.length})` : ""}`}
            subtitle="Klicka på en kista för att öppna den"
          />
          {unopened.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.15)" }}
            >
              <div className="text-4xl mb-3 opacity-40">🎁</div>
              <p className="text-white/50 text-sm font-medium">Inga oöppnade kistor</p>
              <p className="text-white/30 text-xs mt-1">Slutför övningar och nå poängmål för att tjäna kistor</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {unopened.map((chest) => (
                <ChestCard key={chest.id} chest={chest} onOpen={handleOpenChest} />
              ))}
            </div>
          )}
        </section>

        {/* ─── Trophy shelf ── */}
        <TrofHylla chests={gam.chests} />

        {/* ─── Badges ── */}
        <section>
          <SectionTitle
            emoji="🎖️"
            title={`Märken (${gam.badges.length}/${ALL_BADGES.length})`}
            subtitle="Samla alla märken – grå = ej uppnådd ännu"
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {ALL_BADGES.map((badge) => {
              const earned = gam.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-3 rounded-2xl text-center"
                  style={earned ? {
                    background: "linear-gradient(135deg, #312e81, #4c1d95)",
                    border: "1px solid rgba(167,139,250,0.35)",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                  } : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className={`text-3xl mb-1.5 leading-none ${earned ? "" : "grayscale opacity-30"}`}>
                    {earned ? badge.emoji : "🔒"}
                  </span>
                  <span className={`text-[10px] font-bold leading-snug ${earned ? "text-violet-200" : "text-white/35"}`}>
                    {badge.label}
                  </span>
                  {!earned && BADGE_HOW_TO_EARN[badge.id] && (
                    <span className="text-[9px] text-white/25 mt-1 leading-tight">
                      {BADGE_HOW_TO_EARN[badge.id]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── How to earn chests ── */}
        <section>
          <SectionTitle emoji="💡" title="Hur tjänar man kistor?" />
          <div
            className="rounded-2xl p-4 space-y-4"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {/* Point milestones */}
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Poängmål</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {([
                  { type: "wood"    as ChestType, value: "50, 200 p",                                bg: "rgba(120,53,15,0.4)",   border: "rgba(217,119,6,0.3)"   },
                  { type: "silver"  as ChestType, value: "300, 500, 750, 1 500, 2 000 p",            bg: "rgba(30,41,59,0.6)",    border: "rgba(148,163,184,0.3)" },
                  { type: "gold"    as ChestType, value: "1 000, 2 500, 5 000, 10 000, 15 000 p",    bg: "rgba(120,53,15,0.4)",   border: "rgba(251,191,36,0.3)"  },
                  { type: "ruby"    as ChestType, value: "20 000, 30 000 p",                          bg: "rgba(127,29,29,0.4)",   border: "rgba(252,165,165,0.3)" },
                  { type: "diamond" as ChestType, value: "35 000, 50 000 p",                          bg: "rgba(12,74,110,0.4)",   border: "rgba(125,211,252,0.3)" },
                  { type: "emerald" as ChestType, value: "75 000 p",                                  bg: "rgba(6,78,59,0.4)",     border: "rgba(52,211,153,0.3)"  },
                  { type: "hemlig"  as ChestType, value: "100 000, 150 000 p 🔒",                     bg: "rgba(59,7,100,0.5)",    border: "rgba(192,132,252,0.3)" },
                ]).map((row) => (
                  <div key={row.type} className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: row.bg, border: `1px solid ${row.border}` }}>
                    <ChestImage type={row.type} className="w-10 h-8 flex-shrink-0" />
                    <div>
                      <p className="text-white/80 text-xs font-bold">{CHEST_META[row.type].label}</p>
                      <p className="text-white/50 text-[10px] leading-tight mt-0.5">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise milestones */}
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Övningsmål</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {([
                  { type: "wood"    as ChestType, value: "1, 5, 10 övningar",               bg: "rgba(120,53,15,0.4)",   border: "rgba(217,119,6,0.3)"   },
                  { type: "silver"  as ChestType, value: "15, 20, 40, 50 övningar",         bg: "rgba(30,41,59,0.6)",    border: "rgba(148,163,184,0.3)" },
                  { type: "gold"    as ChestType, value: "30, 60, 75, 100, 150 övningar",   bg: "rgba(120,53,15,0.4)",   border: "rgba(251,191,36,0.3)"  },
                  { type: "ruby"    as ChestType, value: "200 övningar",                     bg: "rgba(127,29,29,0.4)",   border: "rgba(252,165,165,0.3)" },
                  { type: "diamond" as ChestType, value: "300 övningar",                     bg: "rgba(12,74,110,0.4)",   border: "rgba(125,211,252,0.3)" },
                  { type: "emerald" as ChestType, value: "500 övningar",                     bg: "rgba(6,78,59,0.4)",     border: "rgba(52,211,153,0.3)"  },
                  { type: "hemlig"  as ChestType, value: "750, 1 000 övningar 🔒",          bg: "rgba(59,7,100,0.5)",    border: "rgba(192,132,252,0.3)" },
                ]).map((row) => (
                  <div key={row.type} className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: row.bg, border: `1px solid ${row.border}` }}>
                    <ChestImage type={row.type} className="w-10 h-8 flex-shrink-0" />
                    <div>
                      <p className="text-white/80 text-xs font-bold">{CHEST_META[row.type].label}</p>
                      <p className="text-white/50 text-[10px] leading-tight mt-0.5">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mystery box */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(49,46,129,0.4)", border: "1px solid rgba(139,92,246,0.3)" }}
            >
              <span className="text-xl leading-none">🎁</span>
              <div>
                <p className="text-white/80 text-xs font-bold">Mysterykista</p>
                <p className="text-white/50 text-[10px] mt-0.5">Extra hög chans i början – upp till 50% de första övningarna!</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {rewardResult && (
        <RewardPopup result={rewardResult} onClose={() => setRewardResult(null)} />
      )}
    </div>
  );
}
