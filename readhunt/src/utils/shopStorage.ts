// Butik – plånbok & ägodelar för Readhunt
// Poäng spenderas från en SEPARAT plånbok = (livstidspoäng − spenderat).
// Livstidstotalen rörs aldrig, så kistor/nivåer påverkas inte.

import { loadUser } from '../services/userService';

export type ShopKind = 'avatar' | 'frame' | 'effect' | 'theme';

export interface ShopData {
  spent: number;
  ownedAvatars: number[];      // index i SHOP_AVATARS
  ownedFrames: string[];
  equippedFrame: string | null;
  ownedEffects: string[];
  equippedEffect: string | null;
  ownedThemes: string[];
  equippedTheme: string | null;
}

// Plånboken lagrades tidigare globalt, så elever som delade enhet delade även
// "spent" och sina köp: en elev kunde ärva en annans skuld och därmed få noll
// i saldo. Lagringen är nu namngiven per elev.
const LEGACY_KEY = 'readhunt_shop';

function shopKey(): string {
  const name = loadUser()?.name?.trim().toLowerCase();
  return name ? `readhunt_shop_${encodeURIComponent(name)}` : LEGACY_KEY;
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
    const key = shopKey();
    const raw = localStorage.getItem(key);
    if (raw) return { ...defaultShop(), ...(JSON.parse(raw) as Partial<ShopData>) };

    // Engångsmigrering: den gamla globala plånboken tillhör den elev som är
    // inloggad vid uppdateringen. Nyckeln tas bort så att ingen annan ärver den.
    if (key !== LEGACY_KEY) {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        localStorage.setItem(key, legacy);
        localStorage.removeItem(LEGACY_KEY);
        return { ...defaultShop(), ...(JSON.parse(legacy) as Partial<ShopData>) };
      }
    }
  } catch { /* ignore */ }
  return defaultShop();
}

export function saveShop(data: ShopData): void {
  try {
    localStorage.setItem(shopKey(), JSON.stringify(data));
  } catch { /* ignore */ }
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

export function isOwned(kind: ShopKind, key: string | number): boolean {
  const shop = loadShop();
  const list = shop[ownedListKey(kind)] as (string | number)[];
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
  key: string | number,
  price: number
): BuyResult {
  const shop = loadShop();
  const listKey = ownedListKey(kind);
  const list = shop[listKey] as (string | number)[];

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

/** Ge en vara gratis (kist-belöning). Lägger till i ägodelar utan att dra poäng. */
export function grantItem(kind: ShopKind, key: string | number): boolean {
  const shop = loadShop();
  const listKey = ownedListKey(kind);
  const list = shop[listKey] as (string | number)[];
  if (list.includes(key)) return false;
  const updated: ShopData = { ...shop, [listKey]: [...list, key] } as ShopData;
  saveShop(updated);
  return true;
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
