import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookLogo } from './BookLogo';
import { AvatarPicker } from './AvatarPicker';
import { JaktLinks } from './JaktLinks';
import { AVATAR_OPTIONS } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { BorderBeam } from './ui/border-beam';
import { Sparkles } from './ui/sparkles';
import { cn } from '@/lib/utils';

interface LoginViewProps {
  onLogin: (name: string, avatar: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim(), selectedAvatar);
    }
  };

  // Decorative floating elements for the background
  const floatingElements = [
    { emoji: '📖', size: 'text-3xl', top: '8%', left: '5%', delay: 0, duration: 20 },
    { emoji: '📚', size: 'text-4xl', top: '15%', right: '8%', delay: 2, duration: 25 },
    { emoji: '📕', size: 'text-2xl', top: '70%', left: '3%', delay: 5, duration: 22 },
    { emoji: '📗', size: 'text-3xl', top: '80%', right: '5%', delay: 8, duration: 18 },
    { emoji: '📘', size: 'text-2xl', top: '40%', left: '2%', delay: 3, duration: 24 },
    { emoji: '🔍', size: 'text-2xl', top: '25%', left: '7%', delay: 4, duration: 21 },
    { emoji: '🧭', size: 'text-3xl', top: '60%', right: '4%', delay: 6, duration: 23 },
    { emoji: '🗺️', size: 'text-2xl', top: '45%', right: '6%', delay: 1, duration: 19 },
    { emoji: '🍃', size: 'text-xl', top: '12%', left: '12%', delay: 7, duration: 16 },
    { emoji: '🌿', size: 'text-2xl', top: '85%', left: '10%', delay: 9, duration: 17 },
    { emoji: '🌲', size: 'text-3xl', top: '5%', right: '15%', delay: 0, duration: 26 },
    { emoji: '🌳', size: 'text-2xl', top: '75%', right: '12%', delay: 4, duration: 20 },
    { emoji: '✨', size: 'text-xl', top: '20%', left: '15%', delay: 2, duration: 14 },
    { emoji: '⭐', size: 'text-lg', top: '30%', right: '10%', delay: 5, duration: 15 },
    { emoji: '💫', size: 'text-xl', top: '55%', left: '8%', delay: 3, duration: 13 },
    { emoji: '🌟', size: 'text-lg', top: '65%', right: '15%', delay: 7, duration: 16 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated floating background elements */}
      {floatingElements.map((el, index) => (
        <motion.div
          key={index}
          className={cn("absolute pointer-events-none select-none", el.size)}
          style={{
            top: el.top,
            left: el.left,
            right: el.right,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {el.emoji}
        </motion.div>
      ))}

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
          <BorderBeam size={300} duration={10} colorFrom="#6366f1" colorTo="#a855f7" />

          <CardHeader className="text-center pb-2">
            <motion.div
              className="flex justify-center mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Sparkles sparklesCount={8} colors={{ first: "#6366f1", second: "#a855f7" }}>
                <BookLogo size={160} />
              </Sparkles>
            </motion.div>
            <CardDescription className="text-indigo-500 dark:text-indigo-400 text-lg font-medium">
              Din smarta läskompis
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="name"
                  className="block text-base font-bold text-slate-800 dark:text-slate-200 mb-2"
                >
                  Vad heter du?
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
                  Välj din avatar
                </label>
                <AvatarPicker
                  selectedAvatar={selectedAvatar}
                  onSelect={setSelectedAvatar}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={!name.trim()}
                  variant="gradient"
                  size="xl"
                  className="w-full"
                >
                  Börja din läsning
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
                Läsjakten hjälper dig att träna läsförståelse på din nivå
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
