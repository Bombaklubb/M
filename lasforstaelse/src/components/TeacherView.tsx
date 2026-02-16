import React, { useState, useEffect } from 'react';
import { StudentMessage } from '../types';
import {
  getStudentMessages,
  markMessageAsRead,
  markAllMessagesAsRead,
  deleteMessage,
} from '../services/userService';

interface TeacherViewProps {
  onClose: () => void;
}

interface GradeCount {
  grade: number;
  count: number;
}

type Tab = 'stats' | 'messages';

export const TeacherView: React.FC<TeacherViewProps> = ({ onClose }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [gradeCounts, setGradeCounts] = useState<GradeCount[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [messages, setMessages] = useState<StudentMessage[]>([]);

  const handleLogin = () => {
    if (password === 'Korsängen') {
      setAuthenticated(true);
      loadLibraryStats();
      loadMessages();
    } else {
      setError('Fel lösenord');
    }
  };

  const loadLibraryStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/library.json');
      const texts = await response.json();

      const counts: Record<number, number> = {};
      texts.forEach((text: { grade: number }) => {
        counts[text.grade] = (counts[text.grade] || 0) + 1;
      });

      const gradeArray: GradeCount[] = Object.entries(counts)
        .map(([grade, count]) => ({ grade: parseInt(grade), count }))
        .sort((a, b) => a.grade - b.grade);

      setGradeCounts(gradeArray);
    } catch (err) {
      console.error('Kunde inte ladda biblioteket:', err);
    }
    setLoading(false);
  };

  const loadMessages = () => {
    const msgs = getStudentMessages();
    // Sortera nyast först
    msgs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    setMessages(msgs);
  };

  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId);
    loadMessages();
  };

  const handleMarkAllAsRead = () => {
    markAllMessagesAsRead();
    loadMessages();
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    loadMessages();
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (authenticated && gradeCounts.length === 0) {
      loadLibraryStats();
    }
  }, [authenticated]);

  const unreadCount = messages.filter(m => !m.read).length;

  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔒</span>
            <h2 className="text-2xl font-bold text-slate-800">Lärarvy</h2>
          </div>
          <p className="text-slate-600 mb-6">Ange lösenord för att se statistik</p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Lösenord"
            className="w-full p-4 border-2 border-slate-200 rounded-xl mb-4 focus:border-purple-500 focus:outline-none"
            autoFocus
          />

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition"
            >
              Logga in
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition"
            >
              Avbryt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Lärarvy</h1>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition"
          >
            Stäng
          </button>
        </div>

        {/* Flikar */}
        <div className="flex gap-2 mb-4 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'stats'
                ? 'bg-purple-100 text-purple-700'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Statistik
          </button>
          <button
            onClick={() => { setActiveTab('messages'); loadMessages(); }}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-purple-100 text-purple-700'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Meddelanden
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Innehåll */}
        <div className="overflow-y-auto flex-1">
          {activeTab === 'stats' && (
            <>
              <p className="text-slate-500 mb-4">Antal texter i biblioteket per årskurs</p>
              {loading ? (
                <p className="text-center text-slate-500 py-8">Laddar...</p>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center">
                  {gradeCounts.map((item) => (
                    <div
                      key={item.grade}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center min-w-[90px]"
                    >
                      <div className="text-sm font-medium text-purple-600 mb-1">
                        {item.grade === 10 ? 'Gym' : `Åk ${item.grade}`}
                      </div>
                      <div className="text-2xl font-black text-purple-700">
                        {item.count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 pt-4 border-t text-center text-slate-500">
                Totalt: {gradeCounts.reduce((sum, g) => sum + g.count, 0)} texter
              </div>
            </>
          )}

          {activeTab === 'messages' && (
            <>
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-slate-500 text-lg">Inga meddelanden än</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Elevernas meddelanden visas här
                  </p>
                </div>
              ) : (
                <>
                  {unreadCount > 0 && (
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium transition"
                      >
                        Markera alla som lästa
                      </button>
                    </div>
                  )}
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-xl border-2 transition ${
                          msg.read
                            ? 'bg-white border-slate-100'
                            : 'bg-purple-50 border-purple-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-2xl flex-shrink-0">{msg.studentAvatar}</span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">
                                  {msg.studentName}
                                </span>
                                {!msg.read && (
                                  <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                    Ny
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400">
                                {formatDate(msg.sentAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {!msg.read && (
                              <button
                                onClick={() => handleMarkAsRead(msg.id)}
                                className="text-xs px-2 py-1 text-purple-600 hover:bg-purple-100 rounded-lg transition"
                                title="Markera som läst"
                              >
                                ✓
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-xs px-2 py-1 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                              title="Ta bort"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 text-slate-700 whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
