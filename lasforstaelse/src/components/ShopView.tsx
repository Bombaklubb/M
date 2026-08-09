import React, { useState, useEffect, useRef } from 'react';
import { loadUser, saveUser } from '../services/userService';
import { useDarkMode } from '../contexts/DarkModeContext';
import { AVATAR_OPTIONS, User } from '../types';
import FramedAvatar from './FramedAvatar';
import {
  SHOP_AVATARS, SHOP_FRAMES, SHOP_EFFECTS, SHOP_THEMES, AVATAR_GROUP_ORDER,
  RARITY_LABELS, RARITY_RING, RARITY_STYLE, type Rarity,
} from '../data/shop';
import {
  loadShop, buyItem, equipFrame, equipEffect, equipTheme, getWalletBalance,
  type ShopData, type ShopKind,
} from '../utils/shopStorage';

type Tab = 'avatar' | 'frame' | 'effect' | 'theme' | 'owned';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'avatar', label: 'Avatarer', icon: '🦊' },
  { id: 'frame', label: 'Ramar', icon: '⭕' },
  { id: 'effect', label: 'Effekter', icon: '✨' },
  { id: 'theme', label: 'Teman', icon: '🎨' },
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
  const avbrytRef = useRef<HTMLButtonElement>(null);

  // Rutan är märkt aria-modal men gick varken att stänga med Escape eller att
  // nå med tangentbord – fokus låg kvar på kortet bakom.
  useEffect(() => {
    avbrytRef.current?.focus();
    const vidTangent = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', vidTangent);
    return () => document.removeEventListener('keydown', vidTangent);
  }, [onCancel]);

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
          <button onClick={onCancel} ref={avbrytRef}
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
//
// Knappen är minst 44 px hög. Den träffytan är minimum för ett barn som pekar
// med fingret på en pekskärm, och korten ligger tätt i rutnätet.
function ActionButton({
  owned, equipped, price, balance, name, onBuy, onEquip,
}: {
  owned: boolean; equipped: boolean; price: number; balance: number; name: string;
  onBuy: () => void; onEquip: () => void;
}) {
  const BAS = 'w-full min-h-[44px] py-2.5 rounded-xl text-sm font-black transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

  if (!owned) {
    const saknas = price - balance;
    if (saknas > 0) {
      // Tidigare stod det bara "Köp" i grått. Eleven såg att knappen inte gick
      // att trycka på men inte varför, och än mindre hur nära hen var. Nu står
      // det hur mycket som fattas, vilket också är ett mål att läsa mot.
      return (
        <div
          className={`${BAS} flex items-center justify-center gap-1 cursor-not-allowed bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600`}
          aria-label={`${name} kostar ${price} poäng. Du behöver ${saknas} poäng till.`}
        >
          <span aria-hidden="true">🔒</span>
          <span>{saknas} kvar</span>
        </div>
      );
    }
    return (
      <button
        onClick={onBuy}
        className={`${BAS} text-white focus-visible:ring-indigo-400`}
        style={{
          background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
          border: '2px solid #4f46e5',
          boxShadow: '0 3px 10px rgba(79,70,229,0.35)',
        }}
      >
        Köp för ⭐ {price}
      </button>
    );
  }

  return (
    <button
      onClick={onEquip}
      className={`${BAS} focus-visible:ring-emerald-400`}
      style={equipped
        ? { background: 'linear-gradient(135deg,#10b981,#047857)', border: '2px solid #047857', color: 'white' }
        : { background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.55)', color: '#047857' }}
      aria-pressed={equipped}
    >
      {equipped ? '✓ Vald' : 'Använd'}
    </button>
  );
}

// Generiskt kort
function ItemCard({
  preview, name, rarity, price, owned, equipped, balance, fyllPlatta, onBuy, onEquip,
}: {
  preview: React.ReactNode; name: string; rarity: Rarity; price: number;
  owned: boolean; equipped: boolean; balance: number; fyllPlatta?: boolean;
  onBuy: () => void; onEquip: () => void;
}) {
  const stil = RARITY_STYLE[rarity];
  const { darkMode } = useDarkMode();

  return (
    <div
      className="relative flex flex-col rounded-2xl p-3 bg-white/95 dark:bg-slate-800/95 transition-shadow duration-200"
      style={{
        // Kanten bär sällsyntheten, utom när varan är vald – då vinner den gröna
        // markeringen, eftersom "det här är påsatt" är viktigare att se.
        border: equipped ? '2px solid #10b981' : `2px solid ${stil.border}`,
        boxShadow: `0 4px 18px ${equipped ? 'rgba(16,185,129,0.25)' : stil.glow}`,
      }}
    >
      {owned && (
        <span
          className="absolute -top-2 -right-1 z-10 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
          style={{ background: 'linear-gradient(135deg,#10b981,#047857)', boxShadow: '0 2px 6px rgba(4,120,87,0.4)' }}
        >
          Köpt
        </span>
      )}

      {/* Platta bakom varan. Ger emojin något att stå på och bär
          sällsynthetsfärgen även när kortet ses på håll.

          För teman är mönstret självt varan, och då fick det bara en liten
          bricka mitt på plattan. Där låter vi förhandsvisningen fylla ytan
          i stället, så att eleven ser vad hen faktiskt köper. */}
      <div
        className={`flex items-center justify-center h-20 mb-2 rounded-xl ${fyllPlatta ? 'overflow-hidden' : ''}`}
        style={fyllPlatta
          ? { border: '1px solid rgba(255,255,255,0.65)' }
          : { background: stil.pedestal, border: '1px solid rgba(255,255,255,0.65)' }}
      >
        {preview}
      </div>

      {/* Namnet får hela kortets bredd. Låg chipet bredvid blev det för trångt
          för ett långt sammansatt ord: "Konstnärssjälen" är ett enda ord och
          kunde varken brytas eller få plats, så det visades som "Konstnärssjä".
          Två rader räcker för alla namn i sortimentet. */}
      <span
        className="block text-sm font-black text-slate-800 dark:text-white leading-tight mb-1.5"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.2rem',
        }}
        title={name}
      >
        {name}
      </span>

      <div className="flex items-center justify-between gap-1.5 mb-2.5 min-h-[1.25rem]">
        <span className="text-xs font-bold">
          {owned
            ? <span className="text-emerald-600 dark:text-emerald-400">{equipped ? 'Används nu' : 'Din'}</span>
            : <span style={{ color: darkMode ? stil.accentDark : stil.accent }}>⭐ {price}</span>}
        </span>
        <RarityChip rarity={rarity} />
      </div>

      <ActionButton
        owned={owned} equipped={equipped} price={price} balance={balance} name={name}
        onBuy={onBuy} onEquip={onEquip}
      />
    </div>
  );
}

interface ShopViewProps {
  onBack: () => void;
  /** Meddelar App när avataren byts så att headern uppdateras direkt. */
  onAvatarChange?: (avatar: string) => void;
}

export default function ShopView({ onBack, onAvatarChange }: ShopViewProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('avatar');
  const [shop, setShop] = useState<ShopData>(loadShop());
  const [confirm, setConfirm] = useState<{
    kind: ShopKind; key: string; price: number; name: string; preview: React.ReactNode;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { darkMode } = useDarkMode();

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
      onAvatarChange?.(emoji);
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
  function avatarCard(a: typeof SHOP_AVATARS[number]) {
    const owned = shop.ownedAvatars.includes(a.id);
    // Fjorton butiksavatarer har samma emoji som en av de gratis avatarerna i
    // profilen. Jämfördes bara emojin fick ett oköpt kort grön "vald"-ram
    // samtidigt som knappen sa Köp. Kortet räknas som valt först när det ägs.
    const equipped = owned && currentEmoji === a.emoji;
    return (
      <ItemCard
        key={`av-${a.id}`}
        // Utan ram och effekt här. Med en påsatt ram ritas avataren i en mörk
        // cirkel, och då blev valpen, kattungen och kaninen omöjliga att skilja
        // åt i rutnätet – just det man ska göra på den här fliken. Hur den ser
        // ut tillsammans med utrustningen syns i köp-rutan och i headern.
        preview={<FramedAvatar emoji={a.emoji} size={56} />}
        name={a.name} rarity={a.rarity} price={a.price}
        owned={owned} equipped={equipped} balance={balance}
        onBuy={() => setConfirm({ kind: 'avatar', key: a.id, price: a.price, name: a.name,
          preview: <FramedAvatar emoji={a.emoji} size={64} frameId={shop.equippedFrame} effectId={shop.equippedEffect} /> })}
        onEquip={() => { updateUserAvatar(a.emoji); showToast(`${a.name} vald!`); }}
      />
    );
  }

  // Avatarer grupperade
  function renderAvatarGroups() {
    return AVATAR_GROUP_ORDER.map(group => {
      const items = SHOP_AVATARS.filter(a => a.group === group);
      if (items.length === 0) return null;
      return (
        <section key={group}>
          <h2 className="text-sm font-black uppercase tracking-wide text-indigo-700/80 dark:text-indigo-300 mb-2 px-0.5">
            {group}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(a => avatarCard(a))}
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
        owned={owned} equipped={equipped} balance={balance}
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
        owned={owned} equipped={equipped} balance={balance}
        onBuy={() => setConfirm({ kind: 'effect', key: e.id, price: e.price, name: e.name,
          preview: <FramedAvatar emoji={currentEmoji} frameId={shop.equippedFrame} effectId={e.id} size={72} /> })}
        onEquip={() => { equipEffect(equipped ? null : e.id); refresh(); showToast(equipped ? 'Effekt borttagen' : `${e.name} på!`); }}
      />
    );
  }

  function renderEffects() {
    return SHOP_EFFECTS.map(effectCard);
  }

  // Tema-swatch (förhandsvisning)
  function themeSwatch(swatch: string, size?: number) {
    // Utan storlek fyller provet hela plattan i kortet. Med storlek används det
    // som liten ikon, till exempel i köp-rutan.
    if (size === undefined) {
      return <div className="w-full h-full" style={{ background: swatch }} />;
    }
    return (
      <div
        className="rounded-2xl"
        style={{ width: size, height: size, background: swatch, border: '2px solid rgba(255,255,255,0.7)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}
      />
    );
  }

  // Tema-kort
  function themeCard(t: typeof SHOP_THEMES[number]) {
    const owned = shop.ownedThemes.includes(t.id);
    const equipped = shop.equippedTheme === t.id;
    return (
      <ItemCard
        key={`th-${t.id}`}
        preview={themeSwatch(t.background)}
        fyllPlatta
        name={t.name} rarity={t.rarity} price={t.price}
        owned={owned} equipped={equipped} balance={balance}
        onBuy={() => setConfirm({ kind: 'theme', key: t.id, price: t.price, name: t.name,
          preview: themeSwatch(t.swatch, 72) })}
        onEquip={() => { equipTheme(equipped ? null : t.id); refresh(); showToast(equipped ? 'Tema borttaget' : `${t.name} på!`); }}
      />
    );
  }

  function renderThemes() {
    return SHOP_THEMES.map(themeCard);
  }

  // "Mina köp"
  function renderOwned() {
    const ownedAvatars = SHOP_AVATARS.filter(a => shop.ownedAvatars.includes(a.id));
    const ownedFrames = SHOP_FRAMES.filter(f => shop.ownedFrames.includes(f.id));
    const ownedEffects = SHOP_EFFECTS.filter(e => shop.ownedEffects.includes(e.id));
    const ownedThemes = SHOP_THEMES.filter(t => shop.ownedThemes.includes(t.id));
    const total = ownedAvatars.length + ownedFrames.length + ownedEffects.length + ownedThemes.length;

    if (total === 0) {
      return (
        <div className="text-center py-14 px-6">
          <div
            className="mx-auto mb-4 flex items-center justify-center rounded-3xl"
            style={{ width: 96, height: 96, background: 'linear-gradient(150deg,#eef2ff,#c7d2fe)', border: '2px solid rgba(99,102,241,0.35)' }}
          >
            <span className="text-5xl" aria-hidden="true">🎁</span>
          </div>
          <p className="font-black text-lg text-indigo-800 dark:text-indigo-200">Hyllan är tom än så länge</p>
          <p className="text-sm mt-1 text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
            Läs texter och svara rätt så samlar du stjärnor. Sedan kan du handla här.
          </p>
          <p className="text-sm mt-3 font-bold" style={{ color: '#4f46e5' }}>
            Du har ⭐ {balance} att handla för
          </p>
        </div>
      );
    }

    const section = (title: string, items: React.ReactNode[]) => items.length === 0 ? null : (
      <section key={title}>
        <h2 className="text-sm font-black uppercase tracking-wide text-indigo-700/80 dark:text-indigo-300 mb-2 px-0.5">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{items}</div>
      </section>
    );

    return (
      <div className="space-y-6">
        {section('Avatarer', ownedAvatars.map(a => avatarCard(a)))}
        {section('Ramar', ownedFrames.map(frameCard))}
        {section('Effekter', ownedEffects.map(effectCard))}
        {section('Teman', ownedThemes.map(themeCard))}
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
        {/* Fem flikar på en Chromebook i 1366 px är gott om plats, men i en smal
            fönsterbredd trängdes texten ihop till oläslighet. Raden får därför
            rulla i sidled i stället för att krympa. */}
        <div
          className="flex overflow-x-auto bg-white/80 dark:bg-slate-800/80 rounded-2xl mb-5 sticky top-0 z-10 backdrop-blur"
          style={{ border: '1px solid rgba(99,102,241,0.30)', boxShadow: '0 2px 12px rgba(99,102,241,0.10)' }}
          role="tablist"
          aria-label="Kategorier i affären"
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              role="tab"
              aria-selected={tab === t.id}
              className={`flex-1 shrink-0 flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 ${
                tab === t.id ? 'text-white' : 'text-indigo-700/80 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-white'
              }`}
              style={tab === t.id ? { background: 'linear-gradient(135deg,#6366f1,#4f46e5)' } : undefined}
            >
              <span aria-hidden="true">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Teman ritas bara i ljust läge, eftersom en ljus bakgrundsbild skulle
            slå ut hela den mörka paletten. Det syntes inte någonstans förut, så
            en elev i mörkt läge kunde köpa ett tema och tro att det var trasigt. */}
        {tab === 'theme' && darkMode && (
          <p
            className="mb-4 rounded-xl px-4 py-3 text-sm font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700"
            role="status"
          >
            🌙 Du har mörkt läge på. Teman syns bara i ljust läge – byt högst upp i appen för att se ditt tema.
          </p>
        )}

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
        ) : tab === 'theme' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-12">
            {renderThemes()}
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
