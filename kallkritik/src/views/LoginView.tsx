import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { listUsers } from '@/lib/userStore';

interface LoginViewProps {
  onLogin: (name: string) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [name, setName] = useState('');
  const previousUsers = listUsers();
  const canSubmit = name.trim().length >= 2;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) onLogin(name);
  }

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-sm"
      >
        <div className="clay-card p-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
            className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-indigo-600 border-[3px] border-indigo-700 flex items-center justify-center shadow-[0_5px_0_0_rgba(67,56,202,0.8)]"
          >
            <Search className="w-7 h-7 text-white" />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-indigo-700 mb-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Källkritikjakten
          </h1>
          <p className="text-sm text-gray-500 font-semibold mb-6">
            Skriv ditt namn för att börja – dina poäng och märken sparas på ditt namn.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-name" className="block text-left text-xs font-extrabold text-gray-400 uppercase tracking-wide mb-2">
              Vad heter du?
            </label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ditt namn"
              autoFocus
              autoComplete="off"
              maxLength={30}
              className="w-full rounded-2xl border-[3px] border-indigo-100 bg-indigo-50/50 px-4 py-3 text-base font-bold text-gray-700 placeholder:text-gray-300 placeholder:font-semibold focus:outline-none focus:border-indigo-300 text-center mb-4"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            />
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={!canSubmit} className="gap-2">
              Starta <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          {/* Tidigare användare på enheten */}
          {previousUsers.length > 0 && (
            <div className="mt-6 pt-5 border-t-2 border-dashed border-indigo-100">
              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-gray-400 uppercase tracking-wide mb-3">
                <Users className="w-3.5 h-3.5" />
                Välkommen tillbaka
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {previousUsers.map(user => (
                  <button
                    key={user}
                    onClick={() => onLogin(user)}
                    className="bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 rounded-full px-4 py-1.5 text-sm font-bold text-indigo-700 transition-colors cursor-pointer"
                    style={{ fontFamily: "'Baloo 2', sans-serif" }}
                  >
                    {user}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs font-semibold text-gray-400 mt-4">
          Inga konton eller lösenord – allt sparas lokalt på den här enheten.
        </p>
      </motion.div>
    </div>
  );
}
