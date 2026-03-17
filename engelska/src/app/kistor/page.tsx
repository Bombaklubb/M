"use client";

import { useState, useEffect } from "react";
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
  getBadge,
  openWoodChest,
  openSilverChest,
  openGoldChest,
} from "@/lib/gamification";
import type { StudentData, GamificationData, Chest, ChestType } from "@/lib/types";

const BG_LIGHT = "linear-gradient(160deg, #0a1744 0%, #0e2882 30%, #1242a0 55%, #0d246b 80%, #0a1744 100%)";
const BG_DARK  = "linear-gradient(160deg, #020810 0%, #040d22 30%, #081535 55%, #040b1c 80%, #020810 100%)";

// ─── Chest Card (unopened) ────────────────────────────────────────────────────

function ChestCard({ chest, onOpen }: { chest: Chest; onOpen: (id: string) => void }) {
  const meta = CHEST_META[chest.type];
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    if (chest.opened || animating) return;
    setAnimating(true);
    setTimeout(() => { onOpen(chest.id); setAnimating(false); }, 500);
  }

  const gradients: Record<ChestType, string> = {
    wood:   "linear-gradient(135deg, #92400e, #78350f)",
    silver: "linear-gradient(135deg, #64748b, #475569)",
    gold:   "linear-gradient(135deg, #d97706, #b45309)",
  };
  const glows: Record<ChestType, string> = {
    wood:   "rgba(146,64,14,0.5)",
    silver: "rgba(100,116,139,0.5)",
    gold:   "rgba(245,158,11,0.6)",
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col items-center p-4 rounded-2xl cursor-pointer select-none"
      style={{
        background: gradients[chest.type],
        border: "2px solid rgba(255,255,255,0.2)",
        boxShadow: `0 6px 24px ${glows[chest.type]}, inset 0 1px 0 rgba(255,255,255,0.25)`,
        transform: animating ? "scale(1.08) rotate(-3deg)" : "scale(1)",
        transition: "transform 0.15s ease-out, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => { if (!animating) e.currentTarget.style.transform = "scale(1.04) translateY(-2px)"; }}
      onMouseLeave={(e) => { if (!animating) e.currentTarget.style.transform = "scale(1)"; }}
    >
      <span
        className="text-4xl mb-2 select-none leading-none"
        style={{ animation: animating ? "shake 0.4s ease-in-out" : "none" }}
      >
        {meta.emoji}
      </span>
      <span className="text-xs font-bold text-white/90">{meta.label}</span>
      <span className="text-[10px] text-white/60 mt-1">Tryck för att öppna</span>

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
    label: "Trälådor",
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
      <div className="flex gap-3 mb-4 flex-wrap">
        {[
          { type: "gold"   as ChestType, label: "Guld",   emoji: "🏆", color: "#fbbf24" },
          { type: "silver" as ChestType, label: "Silver", emoji: "🪙", color: "#cbd5e1" },
          { type: "wood"   as ChestType, label: "Trä",    emoji: "📦", color: "#fdba74" },
        ].map(({ type, label, emoji, color }) => (
          <div
            key={type}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span className="text-sm font-bold" style={{ color }}>{totalByType(type)}</span>
            <span className="text-white/40 text-xs">{label}</span>
          </div>
        ))}
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
      <span className="text-2xl leading-none mb-1">{meta.emoji}</span>
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
        <h2 className="text-xl font-black text-amber-700 mb-2">Lådan är öppnad!</h2>
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
    if (chest.type === "wood")       result = { ...openWoodChest(), badge: undefined, bonusChest: undefined };
    else if (chest.type === "silver") result = openSilverChest(gam.badges);
    else                              result = openGoldChest(gam.badges);

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
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #92400e, #d97706)", boxShadow: "0 0 24px rgba(217,119,6,0.4)" }}
          >
            🏆
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Hemliga Kistor</h1>
            <p className="text-white/50 text-xs">Öppna kistor och bygg din trofhylla</p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 pb-10 space-y-8">

        {/* ─── Boss challenge ── */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: gam.bossUnlocked
              ? "linear-gradient(135deg, #7f1d1d, #991b1b)"
              : "rgba(255,255,255,0.07)",
            border: `1px solid ${gam.bossUnlocked ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
            boxShadow: gam.bossUnlocked ? "0 4px 20px rgba(239,68,68,0.25)" : "none",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{gam.bossUnlocked ? "⚔️" : "🔒"}</span>
              <div>
                <h2 className="text-sm font-black text-white">Boss Challenge</h2>
                <p className="text-white/60 text-xs">
                  {gam.bossUnlocked
                    ? `Du har vunnit ${gam.bossWins} gång${gam.bossWins !== 1 ? "er" : ""} – vinn för att få trälåda!`
                    : `Slutför ${exercisesLeft} övning${exercisesLeft !== 1 ? "ar" : ""} till för att låsa upp`}
                </p>
              </div>
            </div>
            {gam.bossUnlocked ? (
              <Link
                href="/boss"
                className="px-4 py-2 rounded-xl font-bold text-xs text-red-900 cursor-pointer transition-all active:scale-95 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #fef2f2, #fee2e2)", border: "1px solid #fca5a5" }}
              >
                Utmana ⚔️
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-24 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="h-full bg-white/50 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (gam.exercisesCompleted / BOSS_UNLOCK_THRESHOLD) * 100)}%` }}
                  />
                </div>
                <span className="text-white/40 text-xs">{gam.exercisesCompleted}/{BOSS_UNLOCK_THRESHOLD}</span>
              </div>
            )}
          </div>
        </div>

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
        {gam.badges.length > 0 && (
          <section>
            <SectionTitle emoji="🎖️" title={`Märken (${gam.badges.length}/${ALL_BADGES.length})`} subtitle="Samla alla märken i appen" />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {gam.badges.map((badgeId) => {
                const badge = getBadge(badgeId);
                if (!badge) return null;
                return (
                  <div
                    key={badgeId}
                    className="flex flex-col items-center p-4 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, #312e81, #4c1d95)",
                      border: "1px solid rgba(167,139,250,0.3)",
                      boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
                    }}
                  >
                    <span className="text-3xl mb-2 leading-none">{badge.emoji}</span>
                    <span className="text-[10px] font-bold text-violet-200 text-center leading-snug">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { emoji: "📦", label: "Trälåda",    value: "100, 200, 600 p",                           bg: "rgba(120,53,15,0.4)",  border: "rgba(217,119,6,0.3)"   },
                  { emoji: "🪙", label: "Silverlåda", value: "300, 500, 750, 1 500, 2 000 p",            bg: "rgba(30,41,59,0.6)",   border: "rgba(148,163,184,0.3)" },
                  { emoji: "🏆", label: "Guldlåda",   value: "1 000, 2 500, 5 000, 10 000, 15 000 p",   bg: "rgba(120,53,15,0.4)",  border: "rgba(251,191,36,0.3)"  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: row.bg, border: `1px solid ${row.border}` }}>
                    <span className="text-xl leading-none mt-0.5">{row.emoji}</span>
                    <div>
                      <p className="text-white/80 text-xs font-bold">{row.label}</p>
                      <p className="text-white/50 text-[10px] leading-tight mt-0.5">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise milestones */}
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Övningsmål</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { emoji: "📦", label: "Trälåda",    value: "5, 10 övningar",                      bg: "rgba(120,53,15,0.4)",  border: "rgba(217,119,6,0.3)"   },
                  { emoji: "🪙", label: "Silverlåda", value: "15, 20, 40, 50 övningar",             bg: "rgba(30,41,59,0.6)",   border: "rgba(148,163,184,0.3)" },
                  { emoji: "🏆", label: "Guldlåda",   value: "30, 60, 75, 100, 150 övningar",      bg: "rgba(120,53,15,0.4)",  border: "rgba(251,191,36,0.3)"  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: row.bg, border: `1px solid ${row.border}` }}>
                    <span className="text-xl leading-none mt-0.5">{row.emoji}</span>
                    <div>
                      <p className="text-white/80 text-xs font-bold">{row.label}</p>
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
                <p className="text-white/80 text-xs font-bold">Mysterylåda</p>
                <p className="text-white/50 text-[10px] mt-0.5">15% chans att få en slumpmässig belöning efter varje övning!</p>
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
