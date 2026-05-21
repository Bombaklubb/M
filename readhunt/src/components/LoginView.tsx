import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AvatarPicker } from './AvatarPicker';
import { JaktLinks } from './JaktLinks';
import { AVATAR_OPTIONS } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { BorderBeam } from './ui/border-beam';
import { Sparkles } from './ui/sparkles';

interface LoginViewProps {
  onLogin: (name: string, avatar: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onLogin(name.trim(), selectedAvatar);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundImage: 'url(/senaste%20readhunt.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#0c1a2e' }}
    >
      {/* Light overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-20 w-full max-w-md"
      >
        <Card className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
          <BorderBeam size={300} duration={10} colorFrom="#6366f1" colorTo="#a855f7" />

          <CardHeader className="text-center pb-2">
            <motion.div
              className="flex justify-center mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Sparkles sparklesCount={8} colors={{ first: '#6366f1', second: '#a855f7' }}>
                <img src="/readhunt.png" alt="Readhunt" className="w-40 h-40 object-contain drop-shadow-xl" />
              </Sparkles>
            </motion.div>
            <CardDescription className="text-indigo-500 dark:text-indigo-400 text-lg font-medium">
              Your Smart Reading Companion
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="name" className="block text-base font-bold text-slate-800 dark:text-slate-200 mb-2">
                  What is your name?
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 text-lg rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:outline-none transition-all duration-200"
                  autoFocus
                  maxLength={30}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-base font-bold text-slate-800 dark:text-slate-200 mb-3">
                  Choose your avatar
                </label>
                <AvatarPicker selectedAvatar={selectedAvatar} onSelect={setSelectedAvatar} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button type="submit" disabled={!name.trim()} variant="gradient" size="xl" className="w-full">
                  Start reading
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Readhunt helps you practise English reading comprehension at your level
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Jaktlänkar */}
      <motion.div
        className="fixed bottom-2 right-3 text-xs z-[100] pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <JaktLinks />
      </motion.div>
    </div>
  );
};
