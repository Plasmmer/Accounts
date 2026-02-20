import '../../claude-pages.css';

export default function ClaudeSettingsAdditionsPreview() {
  return (
    <main className="page">
      <header className="header">
        <p className="kicker">Claude page</p>
        <h1 className="title">Settings Additions</h1>
        <p className="subtitle">Preview das adições (Subscriptions e Integrations) propostas em <code>SettingsAdditions.jsx</code>.</p>
      </header>

      <section className="card">
        <div className="row"><span className="label">Floflis Pro</span><span className="badge">Ativa</span></div>
        <div className="row"><span className="label">Plasmmer Network</span><span className="pill">Renova 2026-03-01</span></div>
        <div className="row"><span className="label">Shatty Days</span><span className="pill">Expirada</span></div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="row"><span className="label">DAO integrations</span><strong>3 conectadas</strong></div>
        <div className="row"><span className="label">Wallet networks</span><span className="value">Ethereum, Base, Arbitrum</span></div>
      </section>
    </main>
  );
}
