import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AVATARS } from '../data/avatars';

export default function Login() {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(0);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) { setError('Skriv ditt namn (minst 2 bokstäver)'); return; }
    login(name.trim(), avatar);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-3 animate-float">🗺️</div>
          <h1 className="text-4xl font-heading font-bold text-indigo-700 tracking-wide">SO-jakten</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Puls SO · Åk 5</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="clay-card p-6 sm:p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">Ditt namn</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="Skriv ditt namn..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-indigo-200 focus:border-indigo-400 focus:outline-none text-lg font-semibold bg-white placeholder:text-gray-400 transition-colors"
              autoComplete="off"
              autoFocus
              maxLength={30}
            />
            {error && <p className="text-red-500 text-sm mt-1 font-semibold">{error}</p>}
          </div>

          {/* Avatar picker */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-3">Välj din karaktär</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((emoji, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(i)}
                  className={`
                    text-2xl h-12 w-full rounded-xl transition-all active:scale-95 cursor-pointer
                    ${avatar === i
                      ? 'bg-indigo-100 border-2 border-indigo-400 scale-110 shadow-md'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-indigo-50'}
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary-clay w-full py-4 text-lg font-heading"
          >
            Starta jakten! 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
