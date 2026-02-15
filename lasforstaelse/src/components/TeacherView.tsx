import React, { useState, useEffect } from 'react';

interface TeacherViewProps {
  onClose: () => void;
}

interface GradeCount {
  grade: number;
  count: number;
}

export const TeacherView: React.FC<TeacherViewProps> = ({ onClose }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [gradeCounts, setGradeCounts] = useState<GradeCount[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (password === 'Korsängen') {
      setAuthenticated(true);
      loadLibraryStats();
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

  useEffect(() => {
    if (authenticated && gradeCounts.length === 0) {
      loadLibraryStats();
    }
  }, [authenticated]);

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
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Lärarvy</h1>
            <p className="text-slate-500">Antal texter i biblioteket per årskurs</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition"
          >
            Stäng
          </button>
        </div>

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
      </div>
    </div>
  );
};
