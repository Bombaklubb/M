import { Component, type ErrorInfo, type ReactNode } from 'react';
import { clearAllGrundjaktenData } from '@/lib/storage';

/**
 * Sista skyddsnätet.
 *
 * Mönstret finns i matematik/src/App.tsx, men behövs mer här än någon
 * annanstans i repot: den här appens användare kan inte läsa ett
 * felmeddelande, så en vit skärm är en total återvändsgränd. Knappen rensar
 * data och startar om, och den är stor nog att träffa utan hjälp.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Grundjakten kraschade:', error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-4 text-center">
        <span className="text-8xl" aria-hidden>🔧</span>
        <p className="text-2xl font-bold">Något gick fel.</p>
        <button
          type="button"
          onClick={() => {
            clearAllGrundjaktenData();
            window.location.reload();
          }}
          className="btn-pop rounded-tile border-lime-700 bg-lime-500 px-10 py-5 text-2xl
                     font-extrabold text-white"
        >
          Börja om
        </button>
      </div>
    );
  }
}
