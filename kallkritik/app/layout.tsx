import "./globals.css";

export const metadata = {
  title: "Källkritik-specialisten",
  description: "Granska webbadresser och lär dig källkritik med trafikljusmetoden."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <div className="container">
          <div className="nav">
            <div className="row">
              <a className="pill" href="/">
                <span className="lightDot green" />
                <strong>Källkritik-specialisten</strong>
              </a>
              <span className="badge">Trafikljusmetoden • Checklista • Quiz</span>
            </div>
            <div className="links">
              <a className="badge" href="/">Granska</a>
              <a className="badge" href="/learn">Övningar & Quiz</a>
            </div>
          </div>
          {children}
          <div className="hr" />
          <p className="small">
            Obs: Rapporten är en hjälp för källkritik – inte en garanti. Var extra försiktig med inloggningar, betalningar och personuppgifter.
          </p>
        </div>
      </body>
    </html>
  );
}
