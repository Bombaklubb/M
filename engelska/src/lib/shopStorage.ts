import { loadStudent } from "./storage";

// ─── Butik – plånbok & ägodelar ─────────────────────────────────────────────
// Poäng spenderas från en SEPARAT plånbok = (livstidspoäng − spenderat).
// student.totalPoints rörs aldrig, så kistor/utmärkelser påverkas inte.

export type ShopKind = "avatar" | "frame" | "theme" | "effect";

export interface ShopData {
  spent: number;
  ownedAvatars: string[];
  ownedFrames: string[];
  ownedThemes: string[];
  ownedEffects: string[];
  equippedFrame: string | null;
  equippedTheme: string | null;
  equippedEffect: string | null;
}

function key(studentName: string) {
  return `engelskajakten_shop_${studentName.toLowerCase().trim()}`;
}

export function defaultShop(): ShopData {
  return {
    spent: 0,
    ownedAvatars: [], ownedFrames: [], ownedThemes: [], ownedEffects: [],
    equippedFrame: null, equippedTheme: null, equippedEffect: null,
  };
}

export function loadShop(studentName: string): ShopData {
  if (typeof window === "undefined") return defaultShop();
  try {
    const raw = localStorage.getItem(key(studentName));
    if (!raw) return defaultShop();
    return { ...defaultShop(), ...(JSON.parse(raw) as Partial<ShopData>) };
  } catch {
    return defaultShop();
  }
}

export function saveShop(studentName: string, data: ShopData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(studentName), JSON.stringify(data));
}

/** Spenderbart saldo = livstidspoäng − redan spenderat. */
export function getWalletBalance(studentName: string): number {
  const total = loadStudent()?.totalPoints ?? 0;
  const { spent } = loadShop(studentName);
  return Math.max(0, total - spent);
}

function ownedListKey(kind: ShopKind): "ownedAvatars" | "ownedFrames" | "ownedThemes" | "ownedEffects" {
  return kind === "avatar" ? "ownedAvatars"
    : kind === "frame" ? "ownedFrames"
    : kind === "theme" ? "ownedThemes"
    : "ownedEffects";
}

export function isOwned(studentName: string, kind: ShopKind, id: string): boolean {
  const shop = loadShop(studentName);
  return shop[ownedListKey(kind)].includes(id);
}

export interface BuyResult {
  ok: boolean;
  balance: number;
  reason?: "insufficient" | "owned";
}

/** Köp en vara. Drar pris från plånboken och lägger till i ägodelar. */
export function buyItem(studentName: string, kind: ShopKind, id: string, price: number): BuyResult {
  const shop = loadShop(studentName);
  const listKey = ownedListKey(kind);
  const list = shop[listKey];

  if (list.includes(id)) {
    return { ok: false, balance: getWalletBalance(studentName), reason: "owned" };
  }

  const balance = getWalletBalance(studentName);
  if (balance < price) {
    return { ok: false, balance, reason: "insufficient" };
  }

  const updated: ShopData = { ...shop, spent: shop.spent + price, [listKey]: [...list, id] };
  saveShop(studentName, updated);
  return { ok: true, balance: getWalletBalance(studentName) };
}

/** Equipa (eller av-equipa med null) en ram. */
export function equipFrame(studentName: string, id: string | null): ShopData {
  const shop = loadShop(studentName);
  const updated = { ...shop, equippedFrame: id };
  saveShop(studentName, updated);
  return updated;
}

export function getEquippedFrame(studentName: string): string | null {
  return loadShop(studentName).equippedFrame;
}

/** Equipa (eller av-equipa med null) ett tema. */
export function equipTheme(studentName: string, id: string | null): ShopData {
  const shop = loadShop(studentName);
  const updated = { ...shop, equippedTheme: id };
  saveShop(studentName, updated);
  return updated;
}

export function getEquippedTheme(studentName: string): string | null {
  return loadShop(studentName).equippedTheme;
}

/** Equipa (eller av-equipa med null) en effekt. */
export function equipEffect(studentName: string, id: string | null): ShopData {
  const shop = loadShop(studentName);
  const updated = { ...shop, equippedEffect: id };
  saveShop(studentName, updated);
  return updated;
}

export function getEquippedEffect(studentName: string): string | null {
  return loadShop(studentName).equippedEffect;
}
