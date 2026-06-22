import React, { useState } from 'react';
import AppHeader from './AppHeader';
import FramedAvatar from './FramedAvatar';
import { useApp } from '../contexts/AppContext';
import { ALL_AVATARS, shopAvatarGlobalIndex } from '../data/avatars';
import {
  SHOP_AVATARS, SHOP_FRAMES, SHOP_TITLES, SHOP_BACKGROUNDS,
  RARITY_LABELS, RARITY_RING, type Rarity,
} from '../data/shop';
import {
  loadShop, buyItem, equipItem, getWalletBalance,
  type ShopData, type ShopKind,
} from '../utils/shopStorage';

type Tab = 'avatar' | 'frame' | 'title' | 'background';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'avatar',     label: 'Avatarer',  icon: '🦊' },
  { id: 'frame',      label: 'Ramar',     icon: '⭕' },
  { id: 'title',      label: 'Titlar',    icon: '🏷️' },
  { id: 'background', label: 'Bakgrunder', icon: '🖼️' },
];

// ─── Sällsynthetschip ────────────────────────────────────────────────────────────
function RarityChip({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-gradient-to-r ${RARITY_RING[rarity]} text-white`}
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}
    >
      {RARITY_LABELS[rarity]}
    </span>
  );
}

// ─── Köp-bekräftelse ─────────────────────────────────────────────────────────────
function ConfirmBuy({
  name, price, balance, preview, onConfirm, onCancel,
}: {
  name: string; price: number; balance: number;
  preview: React.ReactNode; onConfirm: () => void; onCancel: () => void;
}) {
  const after = balance - price;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      role="dialog" aria-modal="true" aria-label={`Köp ${name}`}>
      <div className="rounded-3xl p-7 max-w-xs w-full text-center"
        style={{
          background: 'linear-gradient(160deg,#fff7ed 0%,#ffedd5 50%,#fefce8 100%)',
          border: '3px solid #f59e0b',
          boxShadow: '0 8px 40px rgba(245,158,11,0.30)',
        }}>
        <div className="flex justify-center mb-3">{preview}</div>
        <h2 className="text-xl font-black text-gray-800 mb-1">Köp {name}?</h2>
        <p className="text-sm text-gray-600 mb-1">Pris: <strong className="text-orange-600">⭐ {price}</strong></p>
        <p className="text-xs text-gray-500 mb-5">Kvar efter köp: ⭐ {after}</p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl font-bold text-gray-600 transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300"
            style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.10)' }}>
            Avbryt
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: '2px solid #d97706' }}>
            Köp ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Köpknapp / equip-knapp ──────────────────────────────────────────────────────
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
        className="w-full py-2 rounded-xl text-sm font-black text-white transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed"
        style={affordable
          ? { background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: '2px solid #d97706', boxShadow: '0 3px 10px rgba(217,119,6,0.35)' }
          : { background: 'rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.10)', color: 'rgba(0,0,0,0.40)' }}
      >
        {affordable ? 'Köp' : 'För dyrt'}
      </button>
    );
  }
  return (
    <button
      onClick={onEquip}
      className="w-full py-2 rounded-xl text-sm font-black transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300"
      style={equipped
        ? { background: 'linear-gradient(135deg,#10b981,#047857)', border: '2px solid #047857', color: 'white' }
        : { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.45)', color: '#047857' }}
    >
      {equipped ? 'Används ✓' : 'Använd'}
    </button>
  );
}

// ─── Generiskt kort ──────────────────────────────────────────────────────────────
function ItemCard({
  preview, name, rarity, price, owned, equipped, affordable, onBuy, onEquip,
}: {
  preview: React.ReactNode; name: string; rarity: Rarity; price: number;
  owned: boolean; equipped: boolean; affordable: boolean;
  onBuy: () => void; onEquip: () => void;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl p-3 transition-all"
      style={{
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(12px)',
        border: equipped ? '2px solid #10b981' : '1px solid rgba(251,146,60,0.35)',
        boxShadow: '0 4px 18px rgba(120,80,20,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-center justify-center h-20 mb-2">{preview}</div>
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-sm font-black text-gray-800 truncate">{name}</span>
        <RarityChip rarity={rarity} />
      </div>
      <div className="text-xs font-bold mb-2.5" style={{ color: '#b45309' }}>
        {owned ? <span className="text-emerald-600">Köpt</span> : <>⭐ {price}</>}
      </div>
      <ActionButton owned={owned} equipped={equipped} affordable={affordable} onBuy={onBuy} onEquip={onEquip} />
    </div>
  );
}

// ─── Huvudvy ─────────────────────────────────────────────────────────────────────
export default function ShopView() {
  const { currentStudent, setView, updateAvatar } = useApp();
  const [tab, setTab] = useState<Tab>('avatar');
  const [shop, setShop] = useState<ShopData | null>(
    currentStudent ? loadShop(currentStudent.id) : null
  );
  const [confirm, setConfirm] = useState<{
    kind: ShopKind; key: string | number; price: number; name: string; preview: React.ReactNode;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!currentStudent || !shop) return null;
  const sid = currentStudent.id;
  const balance = getWalletBalance(sid);
  const currentEmoji = ALL_AVATARS[currentStudent.avatar] ?? ALL_AVATARS[0];

  function refresh() {
    setShop(loadShop(sid));
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function doBuy() {
    if (!confirm) return;
    const res = buyItem(sid, confirm.kind, confirm.key, confirm.price);
    if (res.ok) {
      showToast(`Du köpte ${confirm.name}! 🎉`);
      refresh();
    } else if (res.reason === 'insufficient') {
      showToast('Du har inte råd ännu.');
    }
    setConfirm(null);
  }

  // ─── Flikinnehåll ──────────────────────────────────────────────────────────────
  function renderAvatars() {
    return SHOP_AVATARS.map((a, i) => {
      const globalIdx = shopAvatarGlobalIndex(i);
      const owned = shop!.ownedAvatars.includes(i);
      const equipped = currentStudent!.avatar === globalIdx;
      return (
        <ItemCard
          key={`av-${i}`}
          preview={<span style={{ fontSize: 52, lineHeight: 1 }}>{a.emoji}</span>}
          name={a.name} rarity={a.rarity} price={a.price}
          owned={owned} equipped={equipped} affordable={balance >= a.price}
          onBuy={() => setConfirm({ kind: 'avatar', key: i, price: a.price, name: a.name,
            preview: <span style={{ fontSize: 56 }}>{a.emoji}</span> })}
          onEquip={() => { updateAvatar(globalIdx); showToast(`${a.name} vald!`); }}
        />
      );
    });
  }

  function renderFrames() {
    return SHOP_FRAMES.map(f => {
      const owned = shop!.ownedFrames.includes(f.id);
      const equipped = shop!.equippedFrame === f.id;
      return (
        <ItemCard
          key={`fr-${f.id}`}
          preview={<FramedAvatar emoji={currentEmoji} frameId={f.id} size={64} />}
          name={f.name} rarity={f.rarity} price={f.price}
          owned={owned} equipped={equipped} affordable={balance >= f.price}
          onBuy={() => setConfirm({ kind: 'frame', key: f.id, price: f.price, name: f.name,
            preview: <FramedAvatar emoji={currentEmoji} frameId={f.id} size={72} /> })}
          onEquip={() => { equipItem(sid, 'frame', equipped ? null : f.id); refresh(); showToast(equipped ? 'Ram borttagen' : `${f.name} på!`); }}
        />
      );
    });
  }

  function renderTitles() {
    return SHOP_TITLES.map(t => {
      const owned = shop!.ownedTitles.includes(t.id);
      const equipped = shop!.equippedTitle === t.id;
      const chip = (
        <span className={`px-3 py-1.5 rounded-full text-sm font-black bg-gradient-to-r ${RARITY_RING[t.rarity]} bg-clip-text text-transparent`}
          style={{ border: '1px solid rgba(180,130,40,0.3)' }}>
          {t.label}
        </span>
      );
      return (
        <ItemCard
          key={`ti-${t.id}`}
          preview={chip}
          name={t.label} rarity={t.rarity} price={t.price}
          owned={owned} equipped={equipped} affordable={balance >= t.price}
          onBuy={() => setConfirm({ kind: 'title', key: t.id, price: t.price, name: t.label, preview: chip })}
          onEquip={() => { equipItem(sid, 'title', equipped ? null : t.id); refresh(); showToast(equipped ? 'Titel borttagen' : `Titel: ${t.label}`); }}
        />
      );
    });
  }

  function renderBackgrounds() {
    return SHOP_BACKGROUNDS.map(b => {
      const owned = shop!.ownedBackgrounds.includes(b.id);
      const equipped = shop!.equippedBackground === b.id;
      const swatch = (
        <div className="w-20 h-14 rounded-xl" style={{ background: b.css, border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
      );
      return (
        <ItemCard
          key={`bg-${b.id}`}
          preview={swatch}
          name={b.name} rarity={b.rarity} price={b.price}
          owned={owned} equipped={equipped} affordable={balance >= b.price}
          onBuy={() => setConfirm({ kind: 'background', key: b.id, price: b.price, name: b.name,
            preview: <div className="w-24 h-16 rounded-xl" style={{ background: b.css }} /> })}
          onEquip={() => { equipItem(sid, 'background', equipped ? null : b.id); refresh(); showToast(equipped ? 'Bakgrund borttagen' : `Bakgrund: ${b.name}`); }}
        />
      );
    });
  }

  const content =
    tab === 'avatar' ? renderAvatars() :
    tab === 'frame' ? renderFrames() :
    tab === 'title' ? renderTitles() :
    renderBackgrounds();

  return (
    <div className="min-h-screen">
      <AppHeader />

      {/* Hero med plånbok */}
      <div className="pt-14 text-white" style={{ background: 'linear-gradient(135deg,#78350f 0%,#b45309 50%,#d97706 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => setView('dashboard')}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
          >
            ← Tillbaka
          </button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🛒</span>
              <div>
                <h1 className="text-2xl font-black">Butiken</h1>
                <p className="text-white/70 text-sm">Spendera dina poäng på coola saker!</p>
              </div>
            </div>
            <div className="rounded-2xl px-4 py-2 text-right"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.30)' }}>
              <p className="text-[11px] uppercase tracking-wide text-white/70 font-bold">Att spendera</p>
              <p className="text-2xl font-black tabular-nums">⭐ {balance}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* Flikar */}
        <div className="flex bg-white/70 rounded-2xl overflow-hidden mb-5 sticky top-14 z-10"
          style={{ border: '1px solid rgba(251,146,60,0.30)', boxShadow: '0 2px 12px rgba(120,80,20,0.10)' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer focus:outline-none ${
                tab === t.id ? 'text-white' : 'text-orange-700/70 hover:text-orange-700'
              }`}
              style={tab === t.id ? { background: 'linear-gradient(135deg,#f59e0b,#d97706)' } : undefined}
              aria-pressed={tab === t.id}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Rutnät */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-12">
          {content}
        </div>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg"
          style={{ background: 'linear-gradient(135deg,#10b981,#047857)', animation: 'shop-toast 0.25s ease-out' }}
          role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
