import { getPoints } from './storage';

// ─── Butik – plånbok & ägodelar ─────────────────────────────────────────────────
// Poäng spenderas från en SEPARAT plånbok = (livstidspoäng − spenderat).
// Livstidstotalen (points.total) rörs aldrig, så kistor/nivåer påverkas inte.

export type ShopKind = 'avatar' | 'frame' | 'title' | 'background';

export interface ShopData {
  spent: number;
  ownedAvatars: number[];      // index i SHOP_AVATARS
  ownedFrames: string[];
  ownedTitles: string[];
  ownedBackgrounds: string[];
  equippedFrame: string | null;
  equippedTitle: string | null;
  equippedBackground: string | null;
}

const KEY = (studentId: string) => `math_shop_${studentId}`;

export function defaultShop(): ShopData {
  return {
    spent: 0,
    ownedAvatars: [],
    ownedFrames: [],
    ownedTitles: [],
    ownedBackgrounds: [],
    equippedFrame: null,
    equippedTitle: null,
    equippedBackground: null,
  };
}

export function loadShop(studentId: string): ShopData {
  try {
    const raw = localStorage.getItem(KEY(studentId));
    if (!raw) return defaultShop();
    return { ...defaultShop(), ...(JSON.parse(raw) as Partial<ShopData>) };
  } catch {
    return defaultShop();
  }
}

export function saveShop(studentId: string, data: ShopData): void {
  localStorage.setItem(KEY(studentId), JSON.stringify(data));
}

/** Spenderbart saldo = livstidspoäng − redan spenderat. */
export function getWalletBalance(studentId: string): number {
  const total = getPoints(studentId)?.total ?? 0;
  const { spent } = loadShop(studentId);
  return Math.max(0, total - spent);
}

function ownedListKey(kind: ShopKind): keyof ShopData {
  switch (kind) {
    case 'avatar': return 'ownedAvatars';
    case 'frame': return 'ownedFrames';
    case 'title': return 'ownedTitles';
    case 'background': return 'ownedBackgrounds';
  }
}

export function isOwned(studentId: string, kind: ShopKind, key: string | number): boolean {
  const shop = loadShop(studentId);
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
  studentId: string,
  kind: ShopKind,
  key: string | number,
  price: number
): BuyResult {
  const shop = loadShop(studentId);
  const listKey = ownedListKey(kind);
  const list = shop[listKey] as (string | number)[];

  if (list.includes(key)) {
    return { ok: false, balance: getWalletBalance(studentId), reason: 'owned' };
  }

  const balance = getWalletBalance(studentId);
  if (balance < price) {
    return { ok: false, balance, reason: 'insufficient' };
  }

  const updated: ShopData = {
    ...shop,
    spent: shop.spent + price,
    [listKey]: [...list, key],
  } as ShopData;
  saveShop(studentId, updated);
  return { ok: true, balance: getWalletBalance(studentId) };
}

/** Equipa (eller av-equipa med null) en ram/titel/bakgrund. */
export function equipItem(
  studentId: string,
  kind: 'frame' | 'title' | 'background',
  id: string | null
): ShopData {
  const shop = loadShop(studentId);
  const field =
    kind === 'frame' ? 'equippedFrame' :
    kind === 'title' ? 'equippedTitle' : 'equippedBackground';
  const updated = { ...shop, [field]: id } as ShopData;
  saveShop(studentId, updated);
  return updated;
}

// ─── Snabba läsare för andra vyer (header, profil) ──────────────────────────────

export function getEquippedFrame(studentId: string): string | null {
  return loadShop(studentId).equippedFrame;
}

export function getEquippedTitle(studentId: string): string | null {
  return loadShop(studentId).equippedTitle;
}

export function getEquippedBackground(studentId: string): string | null {
  return loadShop(studentId).equippedBackground;
}
