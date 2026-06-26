"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import FramedAvatar from "@/components/ui/FramedAvatar";
import EffectOverlay from "@/components/ui/EffectOverlay";
import { loadStudent, setAvatar } from "@/lib/storage";
import { getAvatar } from "@/lib/avatars";
import {
  SHOP_AVATARS, SHOP_FRAMES, SHOP_THEMES, SHOP_EFFECTS,
  RARITY_LABELS, RARITY_RING, AVATAR_GROUP_ORDER,
  type Rarity, type ShopAvatar, type ShopFrame, type ShopTheme, type ShopEffect,
} from "@/lib/shop";
import {
  loadShop, buyItem, equipFrame, equipTheme, equipEffect, getWalletBalance, type ShopData, type ShopKind,
} from "@/lib/shopStorage";
import type { StudentData } from "@/lib/types";

type Tab = "avatar" | "frame" | "theme" | "effect" | "owned";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "avatar", label: "Avatarer", icon: "🦊" },
  { id: "frame", label: "Ramar", icon: "⭕" },
  { id: "theme", label: "Teman", icon: "🎨" },
  { id: "effect", label: "Effekter", icon: "✨" },
  { id: "owned", label: "Mina köp", icon: "🎁" },
];

// ─── Förhandsvisningar för tema/effekt ──────────────────────────────────────
function ThemeSwatch({ theme, className = "w-full h-16" }: { theme: ShopTheme; className?: string }) {
  return (
    <div
      className={`${className} rounded-xl border border-black/10 ${theme.animated ? "shop-theme-animated" : ""}`}
      style={{ background: theme.css }}
    />
  );
}

function EffectSwatch({ effectId, className = "w-full h-16" }: { effectId: string; className?: string }) {
  return (
    <div className={`relative ${className} rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900`}>
      <EffectOverlay effectId={effectId} />
    </div>
  );
}

// ─── Sällsynthetschip ──────────────────────────────────────────────────────
function RarityChip({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-gradient-to-r ${RARITY_RING[rarity]} text-white`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)" }}
    >
      {RARITY_LABELS[rarity]}
    </span>
  );
}

// ─── Köp-bekräftelse ───────────────────────────────────────────────────────
function ConfirmBuy({
  name, price, balance, preview, onConfirm, onCancel,
}: {
  name: string; price: number; balance: number;
  preview: ReactNode; onConfirm: () => void; onCancel: () => void;
}) {
  const after = balance - price;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      role="dialog" aria-modal="true" aria-label={`Köp ${name}`}>
      <div className="card max-w-xs w-full text-center bg-white dark:bg-gray-800">
        <div className="flex justify-center mb-3">{preview}</div>
        <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-1">Köp {name}?</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Pris: <strong className="text-amber-600 dark:text-amber-400">⭐ {price}</strong>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Kvar efter köp: ⭐ {after}</p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 transition-all active:scale-95 cursor-pointer">
            Avbryt
          </button>
          <button onClick={onConfirm} className="flex-1 btn-primary bg-emerald-500 hover:bg-emerald-600 py-3">
            Köp ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Köpknapp / equip-knapp ──────────────────────────────────────────────────
function ActionButton({
  owned, equipped, affordable, onBuy, onEquip,
}: {
  owned: boolean; equipped: boolean; affordable: boolean;
  onBuy: () => void; onEquip: () => void;
}) {
  if (!owned) {
    return (
      <button
        onClick={onBuy}
        disabled={!affordable}
        className={`w-full py-2 rounded-xl text-sm font-black transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed ${
          affordable
            ? "text-white bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600"
            : "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700"
        }`}
      >
        {affordable ? "Köp" : "För dyrt"}
      </button>
    );
  }
  return (
    <button
      onClick={onEquip}
      className={`w-full py-2 rounded-xl text-sm font-black transition-all active:scale-95 cursor-pointer ${
        equipped
          ? "text-white bg-gradient-to-b from-emerald-500 to-emerald-600"
          : "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-700"
      }`}
    >
      {equipped ? "Används ✓" : "Använd"}
    </button>
  );
}

// ─── Generiskt kort ────────────────────────────────────────────────────────
function ItemCard({
  preview, name, rarity, price, owned, equipped, affordable, onBuy, onEquip,
}: {
  preview: ReactNode; name: string; rarity: Rarity; price: number;
  owned: boolean; equipped: boolean; affordable: boolean;
  onBuy: () => void; onEquip: () => void;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl p-3 bg-white dark:bg-gray-800 transition-all ${
        equipped ? "border-3 border-emerald-400" : "border-3 border-en-100 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center justify-center h-20 mb-2">{preview}</div>
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-sm font-black text-gray-800 dark:text-gray-100 truncate">{name}</span>
        <RarityChip rarity={rarity} />
      </div>
      <div className="text-xs font-bold mb-2.5 text-amber-600 dark:text-amber-400">
        {owned ? <span className="text-emerald-600 dark:text-emerald-400">Köpt</span> : <>⭐ {price}</>}
      </div>
      <ActionButton owned={owned} equipped={equipped} affordable={affordable} onBuy={onBuy} onEquip={onEquip} />
    </div>
  );
}

export default function ButikPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [shop, setShop] = useState<ShopData | null>(null);
  const [tab, setTab] = useState<Tab>("avatar");
  const [confirm, setConfirm] = useState<{
    kind: ShopKind; id: string; price: number; name: string; preview: ReactNode;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const s = loadStudent();
    setStudent(s);
    if (s) setShop(loadShop(s.name));
  }, []);

  if (!student || !shop) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Du är inte inloggad.</p>
          <Link href="/" className="btn-primary bg-blue-500 hover:bg-blue-600">
            Gå till startsidan
          </Link>
        </div>
      </div>
    );
  }

  const balance = getWalletBalance(student.name);
  const currentAvatar = getAvatar(student.avatar ?? "ninja");

  function refresh() {
    if (!student) return;
    setShop(loadShop(student.name));
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function doBuy() {
    if (!confirm || !student) return;
    const res = buyItem(student.name, confirm.kind, confirm.id, confirm.price);
    if (res.ok) {
      showToast(`Du köpte ${confirm.name}! 🎉`);
      refresh();
    } else if (res.reason === "insufficient") {
      showToast("Du har inte råd ännu.");
    }
    setConfirm(null);
  }

  function avatarCard(a: ShopAvatar) {
    const owned = shop!.ownedAvatars.includes(a.id);
    const equipped = student!.avatar === a.id;
    const previewAvatar = { id: a.id, emoji: a.emoji, name: a.name };
    return (
      <ItemCard
        key={a.id}
        preview={<FramedAvatar avatar={previewAvatar} size={56} />}
        name={a.name} rarity={a.rarity} price={a.price}
        owned={owned} equipped={equipped} affordable={balance >= a.price}
        onBuy={() => setConfirm({
          kind: "avatar", id: a.id, price: a.price, name: a.name,
          preview: <FramedAvatar avatar={previewAvatar} size={64} />,
        })}
        onEquip={() => {
          const updated = setAvatar(student!, a.id);
          setStudent(updated);
          showToast(`${a.name} vald!`);
        }}
      />
    );
  }

  function renderAvatarGroups() {
    return AVATAR_GROUP_ORDER.map((group) => {
      const items = SHOP_AVATARS.filter((a) => a.group === group);
      if (items.length === 0) return null;
      return (
        <section key={group}>
          <h2 className="text-sm font-black uppercase tracking-wide text-en-700/80 dark:text-en-400/80 mb-2 px-0.5">
            {group}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(avatarCard)}
          </div>
        </section>
      );
    });
  }

  function frameCard(f: ShopFrame) {
    const owned = shop!.ownedFrames.includes(f.id);
    const equipped = shop!.equippedFrame === f.id;
    return (
      <ItemCard
        key={f.id}
        preview={<FramedAvatar avatar={currentAvatar} frameId={f.id} size={64} />}
        name={f.name} rarity={f.rarity} price={f.price}
        owned={owned} equipped={equipped} affordable={balance >= f.price}
        onBuy={() => setConfirm({
          kind: "frame", id: f.id, price: f.price, name: f.name,
          preview: <FramedAvatar avatar={currentAvatar} frameId={f.id} size={72} />,
        })}
        onEquip={() => {
          const updated = equipFrame(student!.name, equipped ? null : f.id);
          setShop(updated);
          showToast(equipped ? "Ram borttagen" : `${f.name} på!`);
        }}
      />
    );
  }

  function themeCard(t: ShopTheme) {
    const owned = shop!.ownedThemes.includes(t.id);
    const equipped = shop!.equippedTheme === t.id;
    return (
      <ItemCard
        key={t.id}
        preview={<ThemeSwatch theme={t} />}
        name={t.name} rarity={t.rarity} price={t.price}
        owned={owned} equipped={equipped} affordable={balance >= t.price}
        onBuy={() => setConfirm({
          kind: "theme", id: t.id, price: t.price, name: t.name,
          preview: <ThemeSwatch theme={t} className="w-44 h-24" />,
        })}
        onEquip={() => {
          const updated = equipTheme(student!.name, equipped ? null : t.id);
          setShop(updated);
          showToast(equipped ? "Tema borttaget" : `${t.name} på!`);
        }}
      />
    );
  }

  function effectCard(e: ShopEffect) {
    const owned = shop!.ownedEffects.includes(e.id);
    const equipped = shop!.equippedEffect === e.id;
    return (
      <ItemCard
        key={e.id}
        preview={<EffectSwatch effectId={e.id} />}
        name={e.name} rarity={e.rarity} price={e.price}
        owned={owned} equipped={equipped} affordable={balance >= e.price}
        onBuy={() => setConfirm({
          kind: "effect", id: e.id, price: e.price, name: e.name,
          preview: <EffectSwatch effectId={e.id} className="w-44 h-24" />,
        })}
        onEquip={() => {
          const updated = equipEffect(student!.name, equipped ? null : e.id);
          setShop(updated);
          showToast(equipped ? "Effekt borttagen" : `${e.name} på!`);
        }}
      />
    );
  }

  function renderOwned() {
    const ownedAvatars = SHOP_AVATARS.filter((a) => shop!.ownedAvatars.includes(a.id));
    const ownedFrames = SHOP_FRAMES.filter((f) => shop!.ownedFrames.includes(f.id));
    const ownedThemes = SHOP_THEMES.filter((t) => shop!.ownedThemes.includes(t.id));
    const ownedEffects = SHOP_EFFECTS.filter((e) => shop!.ownedEffects.includes(e.id));
    const total = ownedAvatars.length + ownedFrames.length + ownedThemes.length + ownedEffects.length;

    if (total === 0) {
      return (
        <div className="text-center py-16 text-en-700/60 dark:text-en-400/60">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-bold">Inga köp ännu</p>
          <p className="text-sm mt-1">Köp något i Affären för att se det här!</p>
        </div>
      );
    }

    const section = (title: string, items: ReactNode[]) => items.length === 0 ? null : (
      <section key={title}>
        <h2 className="text-sm font-black uppercase tracking-wide text-en-700/80 dark:text-en-400/80 mb-2 px-0.5">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{items}</div>
      </section>
    );

    return (
      <div className="space-y-6">
        {section("Avatarer", ownedAvatars.map(avatarCard))}
        {section("Ramar", ownedFrames.map(frameCard))}
        {section("Teman", ownedThemes.map(themeCard))}
        {section("Effekter", ownedEffects.map(effectCard))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      {/* Hero med plånbok */}
      <div className="bg-gradient-to-br from-en-600 to-en-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🛒</span>
              <div>
                <h1 className="text-2xl font-black">Affären</h1>
                <p className="text-white/70 text-sm">Spendera dina poäng på coola saker!</p>
              </div>
            </div>
            <div className="rounded-2xl px-4 py-2 text-right bg-white/15 border border-white/30">
              <p className="text-[11px] uppercase tracking-wide text-white/70 font-bold">Att spendera</p>
              <p className="text-2xl font-black tabular-nums">⭐ {balance}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* Flikar */}
        <div className="flex bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-5 sticky top-16 z-10 border-3 border-en-100 dark:border-gray-700">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                tab === t.id ? "text-white bg-en-600" : "text-en-700/70 dark:text-en-400/70 hover:text-en-700"
              }`}
              aria-pressed={tab === t.id}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Innehåll */}
        {tab === "avatar" ? (
          <div className="space-y-6 pb-12">{renderAvatarGroups()}</div>
        ) : tab === "owned" ? (
          <div className="pb-12">{renderOwned()}</div>
        ) : tab === "frame" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-12">
            {SHOP_FRAMES.map(frameCard)}
          </div>
        ) : tab === "theme" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-12">
            {SHOP_THEMES.map(themeCard)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-12">
            {SHOP_EFFECTS.map(effectCard)}
          </div>
        )}
      </main>

      {/* Köp-bekräftelse */}
      {confirm && (
        <ConfirmBuy
          name={confirm.name}
          price={confirm.price}
          balance={balance}
          preview={confirm.preview}
          onConfirm={doBuy}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg bg-gradient-to-b from-emerald-500 to-emerald-600"
          style={{ animation: "shop-toast 0.25s ease-out" }}
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
