// Butik – plånbok & ägodelar för Läsjakten
// Poäng spenderas från en SEPARAT plånbok = (livstidspoäng − spenderat).
// Livstidstotalen rörs aldrig, så kistor/nivåer påverkas inte.

import { loadUser } from '../services/userService';
import { SHOP_AVATARS } from '../data/shop';

export type ShopKind = 'avatar' | 'frame' | 'effect' | 'theme';

export interface ShopData {
  spent: number;
  ownedAvatars: string[];      // avatar-id (migreras från äldre array-index vid inläsning)
  ownedFrames: string[];
  equippedFrame: string | null;
  ownedEffects: string[];
  equippedEffect: string | null;
  ownedThemes: string[];
  equippedTheme: string | null;
}

const KEY_PREFIX = 'lasjakten_shop';

// Elever delar samma webbläsare på skolans Chromebooks – varje elevs köp/utrustning
// måste därför sparas under en nyckel kopplad till inloggat namn, inte globalt.
function currentUserKey(): string {
  const user = loadUser();
  return user ? user.name.trim().toLowerCase() : 'anon';
}

function storageKey(): string {
  return `${KEY_PREFIX}_${currentUserKey()}`;
}

export function defaultShop(): ShopData {
  return {
    spent: 0,
    ownedAvatars: [],
    ownedFrames: [],
    equippedFrame: null,
    ownedEffects: [],
    equippedEffect: null,
    ownedThemes: [],
    equippedTheme: null,
  };
}

export function loadShop(): ShopData {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return defaultShop();
    return migrateLegacyAvatarIndices(normalisera(JSON.parse(raw)));
  } catch {
    return defaultShop();
  }
}

// En enkel sammanslagning med standardvärdena räckte inte: ett sparat fält
// vinner över standardvärdet även när det är null. Låg det ett null i
// ownedFrames kastade isOwned på list.includes(...) och butiken blev vit.
// Ett spent som inte är ett tal gav i stället NaN i plånboken, och då gick
// ingenting att köpa. Varje fält kontrolleras därför för sig.
function normalisera(rad: unknown): ShopData {
  const grund = defaultShop();
  if (!rad || typeof rad !== 'object') return grund;
  const d = rad as Partial<ShopData>;

  // ownedAvatars kan innehålla gamla numeriska index och rensas inte här –
  // migreringen nedan gör om dem till id:n innan de används.
  const lista = (v: unknown, fallback: string[]) => (Array.isArray(v) ? v : fallback);
  const utrustad = (v: unknown) => (typeof v === 'string' ? v : null);

  return {
    spent: typeof d.spent === 'number' && Number.isFinite(d.spent) ? d.spent : grund.spent,
    ownedAvatars: lista(d.ownedAvatars, grund.ownedAvatars),
    ownedFrames: lista(d.ownedFrames, grund.ownedFrames).filter((v) => typeof v === 'string'),
    equippedFrame: utrustad(d.equippedFrame),
    ownedEffects: lista(d.ownedEffects, grund.ownedEffects).filter((v) => typeof v === 'string'),
    equippedEffect: utrustad(d.equippedEffect),
    ownedThemes: lista(d.ownedThemes, grund.ownedThemes).filter((v) => typeof v === 'string'),
    equippedTheme: utrustad(d.equippedTheme),
  };
}

/**
 * Äldre data sparade ägda avatarer som array-index i SHOP_AVATARS. Om katalogens
 * ordning ändras pekar ett gammalt index tyst på fel avatar, så vi migrerar en
 * gång till stabila id:n (som frames/effects/themes redan använder).
 */
function migrateLegacyAvatarIndices(data: ShopData): ShopData {
  const owned = data.ownedAvatars as unknown[];
  const hasLegacyIndex = owned.some(v => typeof v === 'number');
  if (!hasLegacyIndex) return data;

  const migrated = owned
    .map(v => (typeof v === 'number' ? SHOP_AVATARS[v]?.id : v))
    .filter((v): v is string => typeof v === 'string');

  const updated: ShopData = { ...data, ownedAvatars: [...new Set(migrated)] };
  saveShop(updated);
  return updated;
}

export function saveShop(data: ShopData): void {
  // Får inte kasta – en full lagring ska inte krascha butiken mitt i ett köp.
  try {
    localStorage.setItem(storageKey(), JSON.stringify(data));
  } catch (error) {
    console.error('Kunde inte spara butiksdata:', error);
  }
}

/** Spenderbart saldo = livstidspoäng − redan spenderat. */
export function getWalletBalance(): number {
  const user = loadUser();
  const total = user?.totalPoints ?? 0;
  const { spent } = loadShop();
  return Math.max(0, total - spent);
}

function ownedListKey(kind: ShopKind): keyof ShopData {
  switch (kind) {
    case 'avatar': return 'ownedAvatars';
    case 'frame': return 'ownedFrames';
    case 'effect': return 'ownedEffects';
    case 'theme': return 'ownedThemes';
  }
}

export function isOwned(kind: ShopKind, key: string): boolean {
  const shop = loadShop();
  const list = shop[ownedListKey(kind)] as string[];
  return list.includes(key);
}

export interface BuyResult {
  ok: boolean;
  balance: number;
  reason?: 'insufficient' | 'owned';
}

/** Köp en vara. Drar pris från plånboken och lägger till i ägodelar. */
export function buyItem(
  kind: ShopKind,
  key: string,
  price: number
): BuyResult {
  const shop = loadShop();
  const listKey = ownedListKey(kind);
  const list = shop[listKey] as string[];

  if (list.includes(key)) {
    return { ok: false, balance: getWalletBalance(), reason: 'owned' };
  }

  const balance = getWalletBalance();
  if (balance < price) {
    return { ok: false, balance, reason: 'insufficient' };
  }

  const updated: ShopData = {
    ...shop,
    spent: shop.spent + price,
    [listKey]: [...list, key],
  } as ShopData;
  saveShop(updated);
  return { ok: true, balance: getWalletBalance() };
}

/** Equipa (eller av-equipa med null) en ram. */
export function equipFrame(id: string | null): ShopData {
  const shop = loadShop();
  const updated = { ...shop, equippedFrame: id };
  saveShop(updated);
  return updated;
}

export function getEquippedFrame(): string | null {
  return loadShop().equippedFrame;
}

/** Equipa (eller av-equipa med null) en effekt. */
export function equipEffect(id: string | null): ShopData {
  const shop = loadShop();
  const updated = { ...shop, equippedEffect: id };
  saveShop(updated);
  return updated;
}

export function getEquippedEffect(): string | null {
  return loadShop().equippedEffect;
}

/** Equipa (eller av-equipa med null) ett tema. */
export function equipTheme(id: string | null): ShopData {
  const shop = loadShop();
  const updated = { ...shop, equippedTheme: id };
  saveShop(updated);
  return updated;
}

export function getEquippedTheme(): string | null {
  return loadShop().equippedTheme;
}
