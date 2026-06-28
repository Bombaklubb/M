import React, { useState, useEffect } from 'react';
import { loadUser, saveUser } from '../services/userService';
import { AVATAR_OPTIONS, User } from '../types';
import FramedAvatar from './FramedAvatar';
import {
  SHOP_AVATARS, SHOP_FRAMES, SHOP_EFFECTS, AVATAR_GROUP_ORDER,
  RARITY_LABELS, RARITY_RING, type Rarity,
} from '../data/shop';
import {
  loadShop, buyItem, equipFrame, equipEffect, getWalletBalance,
  type ShopData, type ShopKind,
} from '../utils/shopStorage';

type Tab = 'avatar' | 'frame' | 'effect' | 'owned';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'avatar', label: 'Avatarer', icon: '🦊' },
  { id: 'frame', label: 'Ramar', icon: '⭕' },
  { id: 'effect', label: 'Effekter', icon: '✨' },
  { id: 'owned', label: 'Mina köp', icon: '🎁' },
];

// Sällsynthetschip
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

// Köp-bekräftelse
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
          background: 'linear-gradient(160deg,#eef2ff 0%,#e0e7ff 50%,#c7d2fe 100%)',
          border: '3px solid #6366f1',
          boxShadow: '0 8px 40px rgba(99,102,241,0.30)',
        }}>
        <div className="flex justify-center mb-3">{preview}</div>
        <h2 className="text-xl font-black text-gray-800 mb-1">Köp {name}?</h2>
        <p className="text-sm text-gray-600 mb-1">Pris: <strong className="text-indigo-600">⭐ {price}</strong></p>
        <p className="text-xs text-gray-500 mb-5">Kvar efter köp: ⭐ {after}</p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl font-bold text-gray-600 transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
            style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.10)' }}>
            Avbryt
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
            style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', border: '2px solid #4f46e5' }}>
            Köp
          </button>
        </div>
      </div>
    </div>
  );
}

// Köpknapp / equip-knapp
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
        className="w-full py-2 rounded-xl text-sm font-black text-white transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed"
        style={affordable
          ? { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', border: '2px solid #4f46e5', boxShadow: '0 3px 10px rgba(79,70,229,0.35)' }
          : { background: 'rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.10)', color: 'rgba(0,0,0,0.40)' }}
      >
        Köp
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
      {equipped ? '✓ Vald' : 'Använd'}
    </button>
  );
}

// Generiskt kort
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
        border: equipped ? '2px solid #10b981' : '1px solid rgba(99,102,241,0.35)',
        boxShadow: '0 4px 18px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-center justify-center h-20 mb-2">{preview}</div>
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-sm font-black text-gray-800 truncate">{name}</span>
        <RarityChip rarity={rarity} />
      </div>
      <div className="text-xs font-bold mb-2.5" style={{ color: '#4f46e5' }}>
        {owned ? <span className="text-emerald-600">Köpt</span> : <>⭐ {price}</>}
      </div>
      <ActionButton owned={owned} equipped={equipped} affordable={affordable} onBuy={onBuy} onEquip={onEquip} />
    </div>
  );
}

interface ShopViewProps {
  onBack: () => void;
}

export default function ShopView({ onBack }: ShopViewProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('avatar');
  const [shop, setShop] = useState<ShopData>(loadShop());
  const [confirm, setConfirm] = useState<{
    kind: ShopKind; key: string | number; price: number; name: string; preview: React.ReactNode;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setUser(loadUser());
    setShop(loadShop());
  }, []);

  if (!user) return null;

  const balance = getWalletBalance();
  const currentEmoji = user.avatar || AVATAR_OPTIONS[0];

  function refresh() {
    setShop(loadShop());
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function updateUserAvatar(emoji: string) {
    if (user) {
      const updated = { ...user, avatar: emoji };
      saveUser(updated);
      setUser(updated);
    }
  }

  function doBuy() {
    if (!confirm) return;
    const res = buyItem(confirm.kind, confirm.key, confirm.price);
    if (res.ok) {
      showToast(`Du köpte ${confirm.name}! 🎉`);
      refresh();
    } else if (res.reason === 'insufficient') {
      showToast('Du har inte råd ännu.');
    }
    setConfirm(null);
  }

  // Avatar-kort
  function avatarCard(a: typeof SHOP_AVATARS[number], i: number) {
    const owned = shop.ownedAvatars.includes(i);
    const equipped = currentEmoji === a.emoji;
    return (
      <ItemCard
        key={`av-${i}`}
        preview={<FramedAvatar emoji={a.emoji} size={56} frameId={shop.equippedFrame} effectId={shop.equippedEffect} />}
        name={a.name} rarity={a.rarity} price={a.price}
        owned={owned} equipped={equipped} affordable={balance >= a.price}
        onBuy={() => setConfirm({ kind: 'avatar', key: i, price: a.price, name: a.name,
          preview: <FramedAvatar emoji={a.emoji} size={64} frameId={shop.equippedFrame} effectId={shop.equippedEffect} /> })}
        onEquip={() => { updateUserAvatar(a.emoji); showToast(`${a.name} vald!`); }}
      />
    );
  }

  // Avatarer grupperade
  function renderAvatarGroups() {
    return AVATAR_GROUP_ORDER.map(group => {
      const items = SHOP_AVATARS
        .map((a, i) => ({ a, i }))
        .filter(({ a }) => a.group === group);
      if (items.length === 0) return null;
      return (
        <section key={group}>
          <h2 className="text-sm font-black uppercase tracking-wide text-indigo-700/80 mb-2 px-0.5">
            {group}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(({ a, i }) => avatarCard(a, i))}
          </div>
        </section>
      );
    });
  }

  // Ram-kort
  function frameCard(f: typeof SHOP_FRAMES[number]) {
    const owned = shop.ownedFrames.includes(f.id);
    const equipped = shop.equippedFrame === f.id;
    return (
      <ItemCard
        key={`fr-${f.id}`}
        preview={<FramedAvatar emoji={currentEmoji} frameId={f.id} size={64} />}
        name={f.name} rarity={f.rarity} price={f.price}
        owned={owned} equipped={equipped} affordable={balance >= f.price}
        onBuy={() => setConfirm({ kind: 'frame', key: f.id, price: f.price, name: f.name,
          preview: <FramedAvatar emoji={currentEmoji} frameId={f.id} size={72} /> })}
        onEquip={() => { equipFrame(equipped ? null : f.id); refresh(); showToast(equipped ? 'Ram borttagen' : `${f.name} på!`); }}
      />
    );
  }

  function renderFrames() {
    return SHOP_FRAMES.map(frameCard);
  }

  // Effekt-kort
  function effectCard(e: typeof SHOP_EFFECTS[number]) {
    const owned = shop.ownedEffects.includes(e.id);
    const equipped = shop.equippedEffect === e.id;
    return (
      <ItemCard
        key={`fx-${e.id}`}
        preview={<FramedAvatar emoji={currentEmoji} frameId={shop.equippedFrame} effectId={e.id} size={56} />}
        name={e.name} rarity={e.rarity} price={e.price}
        owned={owned} equipped={equipped} affordable={balance >= e.price}
        onBuy={() => setConfirm({ kind: 'effect', key: e.id, price: e.price, name: e.name,
          preview: <FramedAvatar emoji={currentEmoji} frameId={shop.equippedFrame} effectId={e.id} size={72} /> })}
        onEquip={() => { equipEffect(equipped ? null : e.id); refresh(); showToast(equipped ? 'Effekt borttagen' : `${e.name} på!`); }}
      />
    );
  }

  function renderEffects() {
    return SHOP_EFFECTS.map(effectCard);
  }

  // "Mina köp"
  function renderOwned() {
    const ownedAvatars = SHOP_AVATARS.map((a, i) => ({ a, i })).filter(({ i }) => shop.ownedAvatars.includes(i));
    const ownedFrames = SHOP_FRAMES.filter(f => shop.ownedFrames.includes(f.id));
    const ownedEffects = SHOP_EFFECTS.filter(e => shop.ownedEffects.includes(e.id));
    const total = ownedAvatars.length + ownedFrames.length + ownedEffects.length;

    if (total === 0) {
      return (
        <div className="text-center py-16 text-indigo-700/60">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-bold">Inga köp ännu</p>
          <p className="text-sm mt-1">Köp något i butiken för att se det här!</p>
        </div>
      );
    }

    const section = (title: string, items: React.ReactNode[]) => items.length === 0 ? null : (
      <section key={title}>
        <h2 className="text-sm font-black uppercase tracking-wide text-indigo-700/80 mb-2 px-0.5">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{items}</div>
      </section>
    );

    return (
      <div className="space-y-6">
        {section('Avatarer', ownedAvatars.map(({ a, i }) => avatarCard(a, i)))}
        {section('Ramar', ownedFrames.map(frameCard))}
        {section('Effekter', ownedEffects.map(effectCard))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-violet-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero med plånbok */}
      <div className="text-white" style={{ background: 'linear-gradient(135deg,#4338ca 0%,#6366f1 50%,#818cf8 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
          >
            ← Tillbaka
          </button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🛒</span>
              <div>
                <h1 className="text-2xl font-black">Affären</h1>
                <p className="text-white/70 text-sm">Spendera dina poäng på coola saker!</p>
              </div>
            </div>
            <div className="rounded-2xl px-4 py-2 text-right"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.30)' }}>
              <p className="text-[11px] uppercase tracking-wide text-white/70 font-bold">Att spendera</p>
              <p className="text-2xl font-black tabular-nums">⭐ {balance.toLocaleString('sv-SE')}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* Flikar */}
        <div className="flex bg-white/70 rounded-2xl overflow-hidden mb-5 sticky top-0 z-10"
          style={{ border: '1px solid rgba(99,102,241,0.30)', boxShadow: '0 2px 12px rgba(99,102,241,0.10)' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer focus:outline-none ${
                tab === t.id ? 'text-white' : 'text-indigo-700/70 hover:text-indigo-700'
              }`}
              style={tab === t.id ? { background: 'linear-gradient(135deg,#6366f1,#4f46e5)' } : undefined}
              aria-pressed={tab === t.id}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Innehåll */}
        {tab === 'avatar' ? (
          <div className="space-y-6 pb-12">
            {renderAvatarGroups()}
          </div>
        ) : tab === 'owned' ? (
          <div className="pb-12">
            {renderOwned()}
          </div>
        ) : tab === 'effect' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-12">
            {renderEffects()}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-12">
            {renderFrames()}
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg"
          style={{ background: 'linear-gradient(135deg,#10b981,#047857)', animation: 'shop-toast 0.25s ease-out' }}
          role="status">
          {toast}
        </div>
      )}

      <style>{`
        @keyframes shop-toast {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
