import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Fångar oväntade fel så att eleven får ett begripligt meddelande i stället
// för en vit sida mitt i ett prov.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("NP-jakten kraschade:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto mt-10 max-w-lg px-4">
        <div className="rounded-md border-2 border-np bg-white p-6 text-center shadow-page">
          <h1 className="font-serif text-2xl font-bold">Något gick fel</h1>
          <p className="mt-2 leading-relaxed text-stone-600">
            Tyvärr uppstod ett fel i appen. Dina sparade svar finns kvar i
            webbläsaren – ladda om sidan så kan du fortsätta där du var.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-np px-6 py-2 font-bold text-white transition hover:bg-np-dark"
          >
            Ladda om sidan
          </button>
        </div>
      </div>
    );
  }
}
