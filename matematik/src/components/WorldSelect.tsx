import React from 'react';
import { useApp } from '../contexts/AppContext';

export default function WorldSelect() {
  const { setView } = useApp();

  return (
    <div className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: 'url("/Mattejakten startsida.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#07071a',
      }}>

      {/* ── Transparenta klickbara zoner över världskorten ── */}

      {/* 🦖 Dinosaurie Världen – övre vänster */}
      <button
        onClick={() => setView('world-dino')}
        className="absolute rounded-2xl"
        style={{ top: '27%', left: '2%', width: '47%', height: '24%' }}
        aria-label="Dinosaurie Världen"
      />

      {/* 🏰 Fantasy Världen – övre höger */}
      <button
        onClick={() => setView('world-fantasy')}
        className="absolute rounded-2xl"
        style={{ top: '27%', right: '2%', width: '47%', height: '24%' }}
        aria-label="Fantasy Världen"
      />

      {/* 🚀 Sci-Fi Världen – nedre vänster */}
      <button
        onClick={() => setView('world-scifi')}
        className="absolute rounded-2xl"
        style={{ top: '53%', left: '2%', width: '47%', height: '24%' }}
        aria-label="Sci-Fi Världen"
      />

      {/* 🌌 Rymd Akademin – nedre höger */}
      <button
        onClick={() => setView('world-gym')}
        className="absolute rounded-2xl"
        style={{ top: '53%', right: '2%', width: '47%', height: '24%' }}
        aria-label="Rymd Akademin"
      />

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: '8%' }}>
        <button className="flex-1 h-full" onClick={() => setView('dashboard')} aria-label="Hem" />
        <button className="flex-1 h-full" onClick={() => setView('my-results')} aria-label="Resultat" />
        <button className="flex-1 h-full" onClick={() => setView('collection')} aria-label="Samling" />
        <button className="flex-1 h-full" onClick={() => setView('my-page')} aria-label="Min sida" />
      </div>
    </div>
  );
}
