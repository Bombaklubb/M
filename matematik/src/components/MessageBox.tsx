import React, { useState } from 'react';
import { Student } from '../types';
import { sendStudentMessage } from '../utils/messages';

interface Props {
  student: Student;
  onClose: () => void;
}

export default function MessageBox({ student, onClose }: Props) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    sendStudentMessage(student.id, student.name, student.avatar, message);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">Meddelande skickat!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Din lärare kommer att kunna läsa ditt meddelande.
          </p>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black transition-colors"
          >
            Stäng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">💬</span>
          <div>
            <h2 className="text-lg font-black text-gray-800">Skicka meddelande</h2>
            <p className="text-xs text-gray-400">till din lärare</p>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Skriv en fråga, en kommentar eller något du vill berätta för läraren.
        </p>

        {/* Textarea */}
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Skriv ditt meddelande här..."
          rows={4}
          maxLength={500}
          autoFocus
          className="w-full border-2 border-gray-200 focus:border-orange-400 focus:outline-none rounded-2xl px-4 py-3 text-sm resize-none transition-colors"
        />
        <div className="text-right text-xs text-gray-400 mb-4 -mt-1">
          {message.length}/500
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3 rounded-2xl transition-colors"
          >
            Skicka ✉️
          </button>
          <button
            onClick={onClose}
            className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl transition-colors"
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}
