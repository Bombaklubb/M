import React, { useState } from 'react';
import { User, BADGE_DEFINITIONS, BadgeType } from '../types';
import { enableSync, loadUserBySyncCode, syncFromCloud } from '../services/userService';
import { isSupabaseConfigured } from '../services/supabase';

interface ProfileViewProps {
  user: User;
  onClose: () => void;
  onUserUpdate?: (user: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onClose, onUserUpdate }) => {
  const allBadgeTypes = Object.values(BadgeType);
  const earnedBadgeTypes = user.badges.map((b) => b.type);

  const [syncCode, setSyncCode] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [showSyncInput, setShowSyncInput] = useState(false);

  const supabaseReady = isSupabaseConfigured();

  const handleEnableSync = async () => {
    setSyncStatus('loading');
    setSyncMessage('Skapar synkkod...');

    const result = await enableSync(user);
    if (result) {
      setSyncStatus('success');
      setSyncMessage(`Din synkkod är: ${result.syncCode}`);
      if (onUserUpdate) {
        onUserUpdate(result.user);
      }
    } else {
      setSyncStatus('error');
      setSyncMessage('Kunde inte skapa synkkod. Kontrollera att Supabase är konfigurerat.');
    }
  };

  const handleSyncFromCode = async () => {
    if (!syncCode.trim()) return;

    setSyncStatus('loading');
    setSyncMessage('Hämtar data...');

    const cloudUser = await loadUserBySyncCode(syncCode.trim());
    if (cloudUser) {
      setSyncStatus('success');
      setSyncMessage('Synkronisering lyckades!');
      if (onUserUpdate) {
        onUserUpdate(cloudUser);
      }
      setShowSyncInput(false);
      setSyncCode('');
    } else {
      setSyncStatus('error');
      setSyncMessage('Ingen användare hittades med den koden.');
    }
  };

  const handleSyncFromCloud = async () => {
    if (!user.syncCode) return;

    setSyncStatus('loading');
    setSyncMessage('Synkroniserar...');

    const mergedUser = await syncFromCloud(user);
    if (mergedUser) {
      setSyncStatus('success');
      setSyncMessage('Synkronisering lyckades!');
      if (onUserUpdate) {
        onUserUpdate(mergedUser);
      }
    } else {
      setSyncStatus('error');
      setSyncMessage('Kunde inte synkronisera.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl border-b-8 border-indigo-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-900">Min profil</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500">Medlem sedan {new Date(user.createdAt).toLocaleDateString('sv-SE')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
            <span className="text-3xl">⭐</span>
            <div className="text-2xl font-bold text-yellow-700">{user.totalPoints}</div>
            <div className="text-sm text-yellow-600">Poäng</div>
          </div>
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 text-center">
            <span className="text-3xl">📖</span>
            <div className="text-2xl font-bold text-indigo-700">{user.completedTexts.length}</div>
            <div className="text-sm text-indigo-600">Texter</div>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
            <span className="text-3xl">🏅</span>
            <div className="text-2xl font-bold text-purple-700">{user.badges.length}</div>
            <div className="text-sm text-purple-600">Utmärkelser</div>
          </div>
        </div>

        {/* Sync section */}
        {supabaseReady && (
          <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
              <span>🔄</span> Synkronisering
            </h3>

            {user.syncCode ? (
              <div>
                <p className="text-blue-700 mb-2">
                  Din synkkod: <span className="font-mono font-bold text-lg bg-white px-2 py-1 rounded">{user.syncCode}</span>
                </p>
                <p className="text-sm text-blue-600 mb-3">
                  Använd denna kod på en annan enhet för att synka dina resultat.
                </p>
                <button
                  onClick={handleSyncFromCloud}
                  disabled={syncStatus === 'loading'}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {syncStatus === 'loading' ? 'Synkar...' : 'Synka nu'}
                </button>
              </div>
            ) : (
              <div>
                {!showSyncInput ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleEnableSync}
                      disabled={syncStatus === 'loading'}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {syncStatus === 'loading' ? 'Skapar...' : 'Skapa synkkod'}
                    </button>
                    <button
                      onClick={() => setShowSyncInput(true)}
                      className="flex-1 px-4 py-2 bg-white text-blue-600 font-bold rounded-lg border-2 border-blue-300 hover:bg-blue-50 transition"
                    >
                      Har redan en kod
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={syncCode}
                      onChange={(e) => setSyncCode(e.target.value.toUpperCase())}
                      placeholder="Skriv din synkkod här"
                      className="px-4 py-2 border-2 border-blue-300 rounded-lg font-mono text-lg uppercase"
                      maxLength={6}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSyncFromCode}
                        disabled={syncStatus === 'loading' || syncCode.length < 6}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {syncStatus === 'loading' ? 'Hämtar...' : 'Hämta data'}
                      </button>
                      <button
                        onClick={() => {
                          setShowSyncInput(false);
                          setSyncCode('');
                          setSyncStatus('idle');
                          setSyncMessage('');
                        }}
                        className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition"
                      >
                        Avbryt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {syncMessage && (
              <p className={`mt-3 text-sm font-medium ${
                syncStatus === 'success' ? 'text-green-600' :
                syncStatus === 'error' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {syncMessage}
              </p>
            )}
          </div>
        )}

        {/* Grades completed */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-700 mb-3">Årskurser</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((grade) => {
              const completed = user.gradesCompleted.includes(grade);
              return (
                <div
                  key={grade}
                  className={`px-4 py-2 rounded-full font-bold ${
                    completed
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {grade === 10 ? 'Gymnasiet' : `Åk ${grade}`} {completed && '✓'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-lg font-bold text-slate-700 mb-3">Utmärkelser</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allBadgeTypes.map((badgeType) => {
              const badgeDef = BADGE_DEFINITIONS[badgeType];
              const earned = earnedBadgeTypes.includes(badgeType);
              const earnedBadge = user.badges.find((b) => b.type === badgeType);

              return (
                <div
                  key={badgeType}
                  className={`p-3 rounded-xl border-2 text-center ${
                    earned
                      ? 'bg-white border-purple-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}
                >
                  <div className={`text-3xl mb-1 ${!earned && 'grayscale'}`}>
                    {badgeDef.icon}
                  </div>
                  <div className="font-bold text-sm text-slate-800">{badgeDef.name}</div>
                  <div className="text-xs text-slate-500">{badgeDef.description}</div>
                  {earnedBadge && (
                    <div className="text-xs text-green-600 mt-1">
                      {new Date(earnedBadge.earnedAt).toLocaleDateString('sv-SE')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
        >
          Stäng
        </button>
      </div>
    </div>
  );
};
