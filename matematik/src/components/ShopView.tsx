import React, { useState } from 'react';
import AppHeader from './AppHeader';
import FramedAvatar from './FramedAvatar';
import { useApp } from '../contexts/AppContext';
import { ALL_AVATARS, shopAvatarGlobalIndex } from '../data/avatars';
import { dicebearUriFromMarker } from '../utils/dicebear';
import EffectOverlay from './EffectOverlay';
import { Confetti } from './magicui/confetti';
import {
  SHOP_AVATARS, SHOP_FRAMES, SHOP_TITLES, SHOP_BACKGROUNDS, SHOP_EFFECTS,
  RARITY_LABELS, RARITY_RING, AVATAR_GROUP_ORDER, type Rarity, type ShopBackground,
  THEME_CATEGORY_LABELS, THEME_CATEGORY_ORDER,
} from '../data/shop';
import { useThemeArt } from '../utils/useThemeArt';
import {
  loadShop, buyItem, equipItem, getWalletBalance,
  type ShopData, type ShopKind,
} from '../utils/shopStorage';

type Tab = 'avatar' | 'frame' | 'theme' | 'effect' | 'owned';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'avatar', label: 'Avatarer', icon: '🦊' },
  { id: 'frame',  label: 'Ramar',    icon: '⭕' },
  { id: 'theme',  label: 'Teman',    icon: '🎨' },
  { id: 'effect', label: 'Effekter', icon: '✨' },
  { id: 'owned',  label: 'Mina köp', icon: '🎁' },
];

// ─── Scen för provbilderna ──────────────────────────────────────────────────────
// Varje sak står på en liten scen: bakgrund i sällsynthetens färg, en spotlight
// uppifrån och en skugga på golvet. Episka och dyrare saker glittrar.
const STAGE: Record<Rarity, { bg: string; floor: string; glitter: string | null }> = {
  common:    { bg: 'linear-gradient(180deg,#f8fafc 0%,#e2e8f0 100%)', floor: 'rgba(71,85,105,0.35)',  glitter: null },
  rare:      { bg: 'linear-gradient(180deg,#f0f9ff 0%,#bae6fd 100%)', floor: 'rgba(3,105,161,0.35)',  glitter: null },
  epic:      { bg: 'linear-gradient(180deg,#faf5ff 0%,#d8b4fe 100%)', floor: 'rgba(109,40,217,0.35)', glitter: '#9333ea' },
  legendary: { bg: 'linear-gradient(180deg,#fffbeb 0%,#fcd34d 100%)', floor: 'rgba(180,83,9,0.40)',   glitter: '#d97706' },
  mythic:    { bg: 'linear-gradient(180deg,#fdf4ff 0%,#f0abfc 100%)', floor: 'rgba(162,28,175,0.40)', glitter: '#c026d3' },
};

// Glittrets platser i procent av scenen, och hur det är förskjutet i tid
const GLITTER: [number, number, number, number][] = [
  [14, 22, 10, 0], [82, 18, 12, -0.6], [22, 70, 8, -1.2], [86, 64, 9, -1.8], [50, 12, 7, -0.9],
];

function Stage({ rarity, children, className = 'w-full h-24' }: {
  rarity: Rarity; children: React.ReactNode; className?: string;
}) {
  const s = STAGE[rarity];
  return (
    <div className={`relative ${className} rounded-xl overflow-hidden flex items-center justify-center`}
      style={{ background: s.bg, boxShadow: 'inset 0 -6px 12px rgba(0,0,0,0.06)' }}>
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 75% at 50% 0%, rgba(255,255,255,0.9), rgba(255,255,255,0) 72%)' }} />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-1.5 w-20 h-4"
        style={{ background: `radial-gradient(ellipse at center, ${s.floor} 0%, transparent 70%)` }} />
      {s.glitter && GLITTER.map(([x, y, px, delay], i) => (
        <span key={i} className="shop-particle absolute leading-none select-none" aria-hidden="true"
          style={{ left: `${x}%`, top: `${y}%`, fontSize: px, color: s.glitter!,
            animation: `shop-twinkle 2.4s ease-in-out ${delay}s infinite` }}>
          ✦
        </span>
      ))}
      {/* Lite nedflyttad så att sällsynthetsbrickan uppe till vänster inte täcker figuren */}
      <div className="relative mt-3">{children}</div>
    </div>
  );
}

// DiceBear-figurerna har luft runt sig i bilden och ser mindre ut än emojis
// i samma storlek, så de ritas lite större.
function avatarSize(emoji: string, base: number): number {
  return dicebearUriFromMarker(emoji) ? Math.round(base * 1.25) : base;
}

// ─── Förhandsvisningar för tema/effekt ──────────────────────────────────────────
// Provbiten ritas med samma bild som hamnar bakom sidan när temat används.
function ThemeSwatch({ theme, className = 'w-full h-24' }: { theme: ShopBackground; className?: string }) {
  const art = useThemeArt(theme.id);
  return (
    <div
      className={`${className} rounded-xl border border-black/10 bg-slate-200`}
      style={art ? { background: art.preview } : undefined}
    />
  );
}

// Effekten visas runt elevens egen avatar, så man ser hur den blir på profilen.
function EffectSwatch({ effectId, emoji, className = 'w-full h-24' }: {
  effectId: string; emoji: string; className?: string;
}) {
  return (
    <div className={`relative ${className} rounded-xl overflow-hidden flex items-center justify-center`}
      style={{ background: 'radial-gradient(ellipse 70% 90% at 50% 20%, #475569 0%, #1e293b 60%, #0f172a 100%)' }}>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-1.5 w-20 h-4"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)' }} />
      <div className="relative opacity-90"><FramedAvatar emoji={emoji} size={avatarSize(emoji, 40)} /></div>
      <EffectOverlay effectId={effectId} />
    </div>
  );
}

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
      className="flex flex-col rounded-2xl p-2.5 transition-all hover:-translate-y-0.5"
      style={{
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(12px)',
        border: equipped ? '2px solid #10b981' : '1px solid rgba(251,146,60,0.35)',
        boxShadow: '0 4px 18px rgba(120,80,20,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      {/* Sällsyntheten ligger på provbilden, så att namnet får hela bredden */}
      <div className="relative mb-2">
        {preview}
        <div className="absolute top-1.5 left-1.5"><RarityChip rarity={rarity} /></div>
      </div>
      <div className="text-sm font-black text-gray-800 leading-tight line-clamp-2 mb-1 px-0.5" title={name}>{name}</div>
      <div className="text-xs font-bold mb-2.5 px-0.5" style={{ color: '#b45309' }}>
        {owned ? <span className="text-emerald-600">Köpt</span> : <>⭐ {price}</>}
      </div>
      <div className="mt-auto">
        <ActionButton owned={owned} equipped={equipped} affordable={affordable} onBuy={onBuy} onEquip={onEquip} />
      </div>
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
  // Räknare så att konfettin startar om vid varje nytt köp.
  const [celebrateKey, setCelebrateKey] = useState(0);

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
      setCelebrateKey(k => k + 1);
      refresh();
    } else if (res.reason === 'insufficient') {
      showToast('Du har inte råd ännu.');
    }
    setConfirm(null);
  }

  // ─── Flikinnehåll ──────────────────────────────────────────────────────────────
  function avatarCard(a: typeof SHOP_AVATARS[number], i: number) {
    const globalIdx = shopAvatarGlobalIndex(i);
    const owned = shop!.ownedAvatars.includes(i);
    const equipped = currentStudent!.avatar === globalIdx;
    return (
      <ItemCard
        key={`av-${i}`}
        preview={<Stage rarity={a.rarity}><FramedAvatar emoji={a.emoji} size={avatarSize(a.emoji, 56)} /></Stage>}
        name={a.name} rarity={a.rarity} price={a.price}
        owned={owned} equipped={equipped} affordable={balance >= a.price}
        onBuy={() => setConfirm({ kind: 'avatar', key: i, price: a.price, name: a.name,
          preview: <Stage rarity={a.rarity} className="w-44 h-28"><FramedAvatar emoji={a.emoji} size={avatarSize(a.emoji, 72)} /></Stage> })}
        onEquip={() => { updateAvatar(globalIdx); showToast(`${a.name} vald!`); }}
      />
    );
  }

  // Avatarer visas grupperade (Djur, Fantasi, Fordon, Yrken) med rubriker.
  function renderAvatarGroups() {
    return AVATAR_GROUP_ORDER.map(group => {
      const items = SHOP_AVATARS
        .map((a, i) => ({ a, i }))
        .filter(({ a }) => a.group === group);
      if (items.length === 0) return null;
      return (
        <section key={group}>
          <h2 className="text-sm font-black uppercase tracking-wide text-orange-700/80 mb-2 px-0.5">
            {group}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(({ a, i }) => avatarCard(a, i))}
          </div>
        </section>
      );
    });
  }

  function frameCard(f: typeof SHOP_FRAMES[number]) {
    const owned = shop!.ownedFrames.includes(f.id);
    const equipped = shop!.equippedFrame === f.id;
    return (
      <ItemCard
        key={`fr-${f.id}`}
        preview={<Stage rarity={f.rarity}><FramedAvatar emoji={currentEmoji} frameId={f.id} size={62} /></Stage>}
        name={f.name} rarity={f.rarity} price={f.price}
        owned={owned} equipped={equipped} affordable={balance >= f.price}
        onBuy={() => setConfirm({ kind: 'frame', key: f.id, price: f.price, name: f.name,
          preview: <Stage rarity={f.rarity} className="w-44 h-28"><FramedAvatar emoji={currentEmoji} frameId={f.id} size={80} /></Stage> })}
        onEquip={() => { equipItem(sid, 'frame', equipped ? null : f.id); refresh(); showToast(equipped ? 'Ram borttagen' : `${f.name} på!`); }}
      />
    );
  }

  function titleCard(t: typeof SHOP_TITLES[number]) {
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
        preview={<Stage rarity={t.rarity}>{chip}</Stage>}
        name={t.label} rarity={t.rarity} price={t.price}
        owned equipped={equipped} affordable={false}
        onBuy={() => {}}
        onEquip={() => { equipItem(sid, 'title', equipped ? null : t.id); refresh(); showToast(equipped ? 'Titel borttagen' : `Titel: ${t.label}`); }}
      />
    );
  }

  function backgroundCard(b: typeof SHOP_BACKGROUNDS[number]) {
    const owned = shop!.ownedBackgrounds.includes(b.id);
    const equipped = shop!.equippedBackground === b.id;
    return (
      <ItemCard
        key={`bg-${b.id}`}
        preview={<ThemeSwatch theme={b} />}
        name={b.name} rarity={b.rarity} price={b.price}
        owned={owned} equipped={equipped} affordable={balance >= b.price}
        onBuy={() => setConfirm({ kind: 'background', key: b.id, price: b.price, name: b.name,
          preview: <ThemeSwatch theme={b} className="w-52 h-28" /> })}
        onEquip={() => { equipItem(sid, 'background', equipped ? null : b.id); refresh(); showToast(equipped ? 'Tema borttaget' : `Tema: ${b.name}`); }}
      />
    );
  }

  function effectCard(e: typeof SHOP_EFFECTS[number]) {
    const owned = shop!.ownedEffects.includes(e.id);
    const equipped = shop!.equippedEffect === e.id;
    return (
      <ItemCard
        key={`fx-${e.id}`}
        preview={<EffectSwatch effectId={e.id} emoji={currentEmoji} />}
        name={e.name} rarity={e.rarity} price={e.price}
        owned={owned} equipped={equipped} affordable={balance >= e.price}
        onBuy={() => setConfirm({ kind: 'effect', key: e.id, price: e.price, name: e.name,
          preview: <EffectSwatch effectId={e.id} emoji={currentEmoji} className="w-52 h-28" /> })}
        onEquip={() => { equipItem(sid, 'effect', equipped ? null : e.id); refresh(); showToast(equipped ? 'Effekt borttagen' : `Effekt: ${e.name}`); }}
      />
    );
  }

  function renderFrames() {
    return SHOP_FRAMES.map(frameCard);
  }

  // Teman grupperade per kategori, billigast först inom varje grupp
  function renderThemeGroups() {
    return THEME_CATEGORY_ORDER.map(cat => {
      const items = SHOP_BACKGROUNDS
        .filter(b => b.category === cat)
        .sort((a, b) => a.price - b.price);
      if (items.length === 0) return null;
      return (
        <section key={cat}>
          <h2 className="text-sm font-black uppercase tracking-wide text-orange-700/80 mb-2 px-0.5">
            {THEME_CATEGORY_LABELS[cat]}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(backgroundCard)}
          </div>
        </section>
      );
    });
  }

  // "Standardtema" – återställer startsidans/profilen ursprungsbild (inget tema).
  function standardThemeCard() {
    const equipped = shop!.equippedBackground === null;
    const preview = (
      <div className="w-full h-24 rounded-xl border border-black/10"
        style={{ backgroundImage: "url('/Drömmig lärandemiljö med kontorstillbehör.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
    );
    return (
      <ItemCard
        key="bg-standard"
        preview={preview}
        name="Standardtema" rarity="common" price={0}
        owned equipped={equipped} affordable={false}
        onBuy={() => {}}
        onEquip={() => { equipItem(sid, 'background', null); refresh(); showToast('Standardtema valt'); }}
      />
    );
  }

  function renderEffects() {
    return SHOP_EFFECTS.map(effectCard);
  }

  // "Mina köp" – visar bara det man redan äger, grupperat per kategori.
  // Titlar/bakgrunder går inte längre att köpa, men gamla köp visas ändå här.
  function renderOwned() {
    const ownedAvatars = SHOP_AVATARS.map((a, i) => ({ a, i })).filter(({ i }) => shop!.ownedAvatars.includes(i));
    const ownedFrames = SHOP_FRAMES.filter(f => shop!.ownedFrames.includes(f.id));
    const ownedTitles = SHOP_TITLES.filter(t => shop!.ownedTitles.includes(t.id));
    const ownedBackgrounds = SHOP_BACKGROUNDS.filter(b => shop!.ownedBackgrounds.includes(b.id));
    const ownedEffects = SHOP_EFFECTS.filter(e => shop!.ownedEffects.includes(e.id));
    const total = ownedAvatars.length + ownedFrames.length + ownedTitles.length
      + ownedBackgrounds.length + ownedEffects.length;

    if (total === 0) {
      return (
        <div className="text-center py-16 text-orange-700/60">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-bold">Inga köp ännu</p>
          <p className="text-sm mt-1">Köp något i butiken för att se det här!</p>
        </div>
      );
    }

    const section = (title: string, items: React.ReactNode[]) => items.length === 0 ? null : (
      <section key={title}>
        <h2 className="text-sm font-black uppercase tracking-wide text-orange-700/80 mb-2 px-0.5">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{items}</div>
      </section>
    );

    return (
      <div className="space-y-6">
        {section('Avatarer', ownedAvatars.map(({ a, i }) => avatarCard(a, i)))}
        {section('Ramar', ownedFrames.map(frameCard))}
        {section('Teman', [standardThemeCard(), ...ownedBackgrounds.map(backgroundCard)])}
        {section('Effekter', ownedEffects.map(effectCard))}
        {section('Titlar', ownedTitles.map(titleCard))}
      </div>
    );
  }

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
                <h1 className="text-2xl font-black">Affären</h1>
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

        {/* Innehåll */}
        {tab === 'avatar' ? (
          <div className="space-y-6 pb-12">
            {renderAvatarGroups()}
          </div>
        ) : tab === 'theme' ? (
          <div className="space-y-6 pb-12">
            {renderThemeGroups()}
          </div>
        ) : tab === 'owned' ? (
          <div className="pb-12">
            {renderOwned()}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-12">
            {tab === 'frame' ? renderFrames() : renderEffects()}
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

      {/* Konfetti vid köp */}
      {celebrateKey > 0 && <Confetti key={celebrateKey} active duration={2500} />}

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
