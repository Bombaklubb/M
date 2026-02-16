import React, { useState } from 'react';
import { sendStudentMessage } from '../services/userService';

interface StudentMessageBoxProps {
  studentName: string;
  studentAvatar: string;
  onClose: () => void;
}

export const StudentMessageBox: React.FC<StudentMessageBoxProps> = ({
  studentName,
  studentAvatar,
  onClose,
}) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    sendStudentMessage(studentName, studentAvatar, message);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Meddelande skickat!
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Din lärare kommer att kunna läsa ditt meddelande.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition"
          >
            Stäng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">💬</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Skicka meddelande till läraren
          </h2>
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
          Skriv ett meddelande till din lärare. Det kan vara en fråga, en kommentar eller något du vill berätta.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Skriv ditt meddelande här..."
          className="w-full p-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl mb-4 focus:border-purple-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 resize-none"
          rows={4}
          maxLength={500}
          autoFocus
        />

        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {message.length}/500 tecken
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Skicka
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-500 transition"
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
};
