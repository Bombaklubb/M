import React from 'react';
import { useApp } from '../contexts/AppContext';
import {
  BASE_AVATARS, WORLD_AVATAR_PACKS, ALL_AVATARS,
  isWorldPackUnlocked, shopAvatarGlobalIndex,
} from '../data/avatars';
import { SHOP_AVATARS } from '../data/shop';
import { loadShop } from '../utils/shopStorage';
import FramedAvatar from './FramedAvatar';

interface Props {
  onClose: () => void;
}

export default function AvatarPicker({ onClose }: Props) {
  const { currentStudent, updateAvatar, setView } = useApp();
  if (!currentStudent) return null;

  function handleSelect(index: number) {
    updateAvatar(index);
    onClose();
  }

  const currentIndex = currentStudent.avatar;
  const ownedShopAvatars = loadShop(currentStudent.id).ownedAvatars;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-800">Välj avatar</h2>
            <p className="text-xs text-gray-400">Klicka på din nya hjälte</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Base avatars */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Grundhjältar</p>
            <div className="grid grid-cols-4 gap-2">
              {BASE_AVATARS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`text-3xl p-2.5 rounded-2xl transition-all ${
                    currentIndex === i
                      ? 'bg-amber-100 ring-2 ring-amber-400 scale-110 shadow-md'
                      : 'bg-gray-50 hover:bg-amber-50 hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* World avatar packs */}
          {WORLD_AVATAR_PACKS.map((pack, packIdx) => {
            const unlocked = isWorldPackUnlocked(currentStudent.id, pack.worldId);
            const baseOffset = BASE_AVATARS.length + packIdx * 4;

            return (
              <div key={pack.worldId}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{pack.worldEmoji}</span>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {pack.worldName}
                  </p>
                  {!unlocked && (
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                      🔒 Låst
                    </span>
                  )}
                </div>

                {unlocked ? (
                  <div className="grid grid-cols-4 gap-2">
                    {pack.avatars.map((emoji, j) => {
                      const index = baseOffset + j;
                      return (
                        <button
                          key={j}
                          onClick={() => handleSelect(index)}
                          className={`text-3xl p-2.5 rounded-2xl transition-all ${
                            currentIndex === index
                              ? 'bg-amber-100 ring-2 ring-amber-400 scale-110 shadow-md'
                              : 'bg-gray-50 hover:bg-amber-50 hover:scale-105'
                          }`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-3 text-center">
                    <div className="flex justify-center gap-2 mb-1.5 opacity-30 grayscale">
                      {pack.avatars.map((emoji, j) => (
                        <span key={j} className="text-2xl">{emoji}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{pack.unlockHint}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Butiks-avatarer */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🛒</span>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Butiksavatarer</p>
            </div>
            {ownedShopAvatars.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {ownedShopAvatars.map(shopIdx => {
                  const a = SHOP_AVATARS[shopIdx];
                  if (!a) return null;
                  const index = shopAvatarGlobalIndex(shopIdx);
                  return (
                    <button
                      key={shopIdx}
                      onClick={() => handleSelect(index)}
                      title={a.name}
                      className={`flex items-center justify-center p-2.5 rounded-2xl transition-all ${
                        currentIndex === index
                          ? 'bg-amber-100 ring-2 ring-amber-400 scale-110 shadow-md'
                          : 'bg-gray-50 hover:bg-amber-50 hover:scale-105'
                      }`}
                    >
                      <FramedAvatar emoji={a.emoji} size={34} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <button
                onClick={() => { onClose(); setView('shop'); }}
                className="w-full bg-gray-50 rounded-2xl p-3 text-center hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <p className="text-xs text-gray-400">Inga köpta ännu – tryck för att besöka butiken 🛒</p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
