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

const KEY = 'readhunt_shop';

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
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultShop();
    return { ...defaultShop(), ...(JSON.parse(raw) as Partial<ShopData>) };
  } catch {
    return defaultShop();
  }
}

export function saveShop(data: ShopData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
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
